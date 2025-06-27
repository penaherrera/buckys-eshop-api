import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ConsoleLogger, Logger } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { createPrismaMockService } from '../../common/mocks';
import { SizeEnum } from '../enums/size.enum';
import { CreateVariantInput } from '../dtos/create-variant.input';
import { loggerMock, variantsMock } from '../../common/mocks/mock';

describe('VariantsService', () => {
  let service: VariantsService;
  let prismaMockService;

  beforeEach(async () => {
    prismaMockService = createPrismaMockService();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariantsService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    })
      .setLogger(loggerMock as unknown as ConsoleLogger)
      .compile();

    service = module.get<VariantsService>(VariantsService);
  });

  const createVariantInputs: CreateVariantInput[] = [
    {
      color: 'red',
      size: SizeEnum.SMALL,
      stock: 100,
    },
    {
      color: 'blue',
      size: SizeEnum.MEDIUM,
      stock: 50,
    },
  ];

  describe('createMany', () => {
    it('should create multiple variants for a product', async () => {
      const createVariantsData = {
        productId: 1,
        variants: createVariantInputs,
      };

      prismaMockService.$transaction.mockResolvedValueOnce([]);

      await service.createMany(createVariantsData);

      expect(prismaMockService.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMockService.$transaction).toHaveBeenCalledWith(
        expect.any(Array),
      );
    });

    it('should handle empty variants array', async () => {
      const createVariantsData = {
        productId: 1,
        variants: [],
      };

      prismaMockService.$transaction.mockResolvedValueOnce([]);

      await service.createMany(createVariantsData);

      expect(prismaMockService.$transaction).toHaveBeenCalledWith([]);
    });
  });

  describe('getAllVariantsByProductIds', () => {
    it('should return variants grouped by product IDs', async () => {
      const productIds = [1, 2];
      prismaMockService.variant.findMany.mockResolvedValueOnce(variantsMock);

      const result = await service.getAllVariantsByProductIds(productIds);

      expect(prismaMockService.variant.findMany).toHaveBeenCalledWith({
        where: { productId: { in: productIds } },
        orderBy: { productId: 'asc' },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2); // Product 1 has 2 variants
      expect(result[1]).toHaveLength(1); // Product 2 has 1 variant

      // Check that size enum is properly converted
      expect(result[0][0].size).toBe(SizeEnum.SMALL);
      expect(result[0][1].size).toBe(SizeEnum.MEDIUM);
      expect(result[1][0].size).toBe(SizeEnum.LARGE);
    });

    it('should return variants in the same order as requested product IDs', async () => {
      const productIds = [2, 1];
      prismaMockService.variant.findMany.mockResolvedValueOnce(variantsMock);

      const result = await service.getAllVariantsByProductIds(productIds);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(1); // Product 2 has 1 variant
      expect(result[1]).toHaveLength(2); // Product 1 has 2 variants
      expect(result[0][0].productId).toBe(2);
      expect(result[1][0].productId).toBe(1);
    });

    it('should return empty arrays for products with no variants', async () => {
      const productIds = [1, 3]; // Product 3 has no variants
      const variantsForProduct1 = variantsMock.filter((v) => v.productId === 1);
      prismaMockService.variant.findMany.mockResolvedValueOnce(
        variantsForProduct1,
      );

      const result = await service.getAllVariantsByProductIds(productIds);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2); // Product 1 has variants
      expect(result[1]).toHaveLength(0); // Product 3 has no variants
    });

    it('should handle empty product IDs array', async () => {
      const productIds: number[] = [];
      prismaMockService.variant.findMany.mockResolvedValueOnce([]);

      const result = await service.getAllVariantsByProductIds(productIds);

      expect(result).toEqual([]);
      expect(prismaMockService.variant.findMany).toHaveBeenCalledWith({
        where: { productId: { in: productIds } },
        orderBy: { productId: 'asc' },
      });
    });
  });

  describe('removeAllByProductId', () => {
    it('should successfully remove all variants for a product when no orders exist', async () => {
      const productId = 1;

      prismaMockService.order.findFirst.mockResolvedValueOnce(null);
      prismaMockService.variant.deleteMany.mockResolvedValueOnce({ count: 2 });

      await service.removeAllByProductId(productId);

      expect(prismaMockService.order.findFirst).toHaveBeenCalledWith({
        where: {
          cart: {
            cartProducts: {
              some: {
                variant: {
                  productId: productId,
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      expect(prismaMockService.variant.deleteMany).toHaveBeenCalledWith({
        where: {
          productId: productId,
        },
      });
    });

    it('should throw ConflictException when product has variants associated with existing orders', async () => {
      const productId = 1;
      const existingOrder = { id: 123 };

      prismaMockService.order.findFirst.mockResolvedValueOnce(existingOrder);

      await expect(service.removeAllByProductId(productId)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaMockService.order.findFirst).toHaveBeenCalledWith({
        where: {
          cart: {
            cartProducts: {
              some: {
                variant: {
                  productId: productId,
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      expect(prismaMockService.variant.deleteMany).not.toHaveBeenCalled();
    });

    it('should throw ConflictException with correct message when order exists', async () => {
      const productId = 5;
      const existingOrder = { id: 456 };

      prismaMockService.order.findFirst.mockResolvedValueOnce(existingOrder);

      await expect(service.removeAllByProductId(productId)).rejects.toThrow(
        new ConflictException(
          `Cannot delete product with ID ${productId} because it has variants associated with existing orders`,
        ),
      );
    });
  });
});
