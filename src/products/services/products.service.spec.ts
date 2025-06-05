import {
  createPrismaMockService,
  createVariantsMockService,
} from '../../common/mocks';
import { ProductsService } from './products.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProductWithVariantsInput } from '../dtos/create-product-variants.input';
import { ClothingTypeEnum } from '../enums/clothing-type.enum';
import { GenderEnum } from '../enums/gender.enum';
import { SizeEnum } from '../../variants/enums/size.enum';
import { brandMock1, categoryMock, productMock } from '../../common/mocks/mock';
import { VariantsService } from '../../variants/services/variants.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductInput } from '../dtos/update-product.input';
import { PaginationArgs } from '../../common/pagination/dtos/pagination.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaMockService;
  let variantsMockService;

  beforeEach(async () => {
    prismaMockService = createPrismaMockService();
    variantsMockService = createVariantsMockService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
        {
          provide: VariantsService,
          useValue: variantsMockService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  const params: CreateProductWithVariantsInput = {
    product: {
      name: 'Sample',
      categoryId: 1,
      brandId: 1,
      description: 'Sample product description',
      isActive: true,
      inStock: true,
      clothingType: ClothingTypeEnum.CLOTHING,
      gender: GenderEnum.UNISEX,
      price: 100,
    },
    variants: [
      {
        stock: 100,
        color: 'red',
        size: SizeEnum.SMALL,
      },
      {
        stock: 100,
        color: 'blue',
        size: SizeEnum.MEDIUM,
      },
    ],
  };

  const mockProducts = [
    { ...productMock, id: 1 },
    { ...productMock, id: 2 },
  ];

  describe('create', () => {
    it('should create a product', async () => {
      prismaMockService.category.findUnique.mockResolvedValueOnce(categoryMock);
      prismaMockService.brand.findUnique.mockResolvedValueOnce(brandMock1);
      prismaMockService.product.create.mockResolvedValueOnce(productMock);

      const result = await service.create(params.product);

      expect(prismaMockService.product.create).toHaveBeenCalledWith({
        data: {
          ...params.product,
        },
      });
      expect(result).toBeDefined();
    });

    it('should throw a NotFoundException if category not found', async () => {
      const testProduct = { ...params.product, categoryId: 9999 };

      prismaMockService.category.findUnique.mockResolvedValueOnce(null);
      prismaMockService.brand.findUnique.mockResolvedValueOnce(brandMock1);

      await expect(service.create(testProduct)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMockService.product.create).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException if brand not found', async () => {
      const testProduct = { ...params.product, brandId: 9999 };

      prismaMockService.category.findUnique.mockResolvedValueOnce(categoryMock);
      prismaMockService.brand.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(testProduct)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMockService.product.create).not.toHaveBeenCalled();
    });
  });

  describe('createWithVariants', () => {
    it('should create variants of a product', async () => {
      prismaMockService.category.findUnique.mockResolvedValueOnce(categoryMock);
      prismaMockService.brand.findUnique.mockResolvedValueOnce(brandMock1);
      prismaMockService.product.create.mockResolvedValueOnce(productMock);

      const result = await service.createWithVariants(params);

      expect(variantsMockService.createMany).toHaveBeenCalledWith({
        productId: productMock.id,
        variants: params.variants,
      });
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const args: PaginationArgs = { page: 1, perPage: 10 };
      const total = 2;

      prismaMockService.product.findMany.mockResolvedValueOnce(mockProducts);
      prismaMockService.product.count.mockResolvedValueOnce(total);

      const result = await service.findAll(args);

      expect(prismaMockService.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          brand: true,
          variants: true,
        },
      });
      expect(prismaMockService.product.count).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result.data).toHaveLength(2);
      expect(result.meta).toBeDefined();
    });

    it('should filter by categoryId when provided', async () => {
      const args: PaginationArgs = { page: 1, perPage: 10, categoryId: 1 };
      const total = 1;

      prismaMockService.product.findMany.mockResolvedValueOnce([
        mockProducts[0],
      ]);
      prismaMockService.product.count.mockResolvedValueOnce(total);

      await service.findAll(args);

      expect(prismaMockService.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true, categoryId: 1 },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          brand: true,
          variants: true,
        },
      });
    });
  });

  describe('update', () => {
    const updateInput: UpdateProductInput = {
      name: 'Updated Product',
      description: 'Updated description',
      price: 150,
    };

    it('should update a product successfully', async () => {
      const updatedProduct = { ...productMock, ...updateInput };

      prismaMockService.product.findUnique.mockResolvedValueOnce(productMock);
      prismaMockService.product.update.mockResolvedValueOnce(updatedProduct);

      const result = await service.update(1, updateInput);

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMockService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateInput,
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if product not found', async () => {
      prismaMockService.product.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(999, updateInput)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMockService.product.update).not.toHaveBeenCalled();
    });

    it('should validate categoryId and brandId if provided in update', async () => {
      const updateWithIds = { ...updateInput, categoryId: 1, brandId: 1 };
      const updatedProduct = { ...productMock, ...updateWithIds };

      prismaMockService.product.findUnique.mockResolvedValueOnce(productMock);
      prismaMockService.category.findUnique.mockResolvedValueOnce(categoryMock);
      prismaMockService.brand.findUnique.mockResolvedValueOnce(brandMock1);
      prismaMockService.product.update.mockResolvedValueOnce(updatedProduct);

      await service.update(1, updateWithIds);

      expect(prismaMockService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMockService.brand.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      prismaMockService.product.findUnique.mockResolvedValueOnce(productMock);
      variantsMockService.removeAllByProductId.mockResolvedValueOnce(true);
      prismaMockService.product.delete.mockResolvedValueOnce(productMock);

      const result = await service.remove(1);

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(variantsMockService.removeAllByProductId).toHaveBeenCalledWith(1);
      expect(prismaMockService.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if product not found', async () => {
      prismaMockService.product.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);

      expect(variantsMockService.removeAllByProductId).not.toHaveBeenCalled();
      expect(prismaMockService.product.delete).not.toHaveBeenCalled();
    });
  });

  describe('toggleActive', () => {
    it('should toggle product from active to inactive', async () => {
      const activeProduct = { ...productMock, isActive: true };
      const inactiveProduct = {
        ...productMock,
        isActive: false,
        deletedAt: new Date(),
      };

      prismaMockService.product.findUnique.mockResolvedValueOnce(activeProduct);
      prismaMockService.product.update.mockResolvedValueOnce(inactiveProduct);

      const result = await service.toggleActive(1);

      expect(prismaMockService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          isActive: false,
          deletedAt: expect.any(Date),
        },
      });
      expect(result).toBeDefined();
    });

    it('should toggle product from inactive to active', async () => {
      const inactiveProduct = {
        ...productMock,
        isActive: false,
        deletedAt: new Date(),
      };
      const activeProduct = { ...productMock, isActive: true, deletedAt: null };

      prismaMockService.product.findUnique.mockResolvedValueOnce(
        inactiveProduct,
      );
      prismaMockService.product.update.mockResolvedValueOnce(activeProduct);

      const result = await service.toggleActive(1);

      expect(prismaMockService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          isActive: true,
          deletedAt: null,
        },
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if product not found', async () => {
      prismaMockService.product.findUnique.mockResolvedValueOnce(null);

      await expect(service.toggleActive(999)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMockService.product.update).not.toHaveBeenCalled();
    });
  });
});
