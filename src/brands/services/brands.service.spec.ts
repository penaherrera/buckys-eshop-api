import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BrandsService } from './brands.service';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import {
  brandMock1,
  brandMock2,
  brandProductsMock,
} from '../../common/mocks/mock';
import { createPrismaMockService } from '../../common/mocks';

describe('BrandsService', () => {
  let service: BrandsService;
  let prismaMockService = createPrismaMockService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  describe('getAllBrandsByProductIds', () => {
    it('should return brands for all product IDs', async () => {
      const productIds = [1, 2];
      prismaMockService.product.findMany.mockResolvedValueOnce(brandProductsMock);

      const result = await service.getAllBrandsByProductIds(productIds);

      expect(prismaMockService.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: productIds } },
        include: { brand: true },
      });
      expect(result).toEqual([brandMock1, brandMock2]);
    });

    it('should throw NotFoundException if any product has no brand', async () => {
      const productsWithMissingBrand = [
        ...brandProductsMock,
        {
          ...brandProductsMock[0],
          id: 3,
          brand: null,
        },
      ];
      prismaMockService.product.findMany.mockResolvedValueOnce(
        productsWithMissingBrand,
      );

      await expect(service.getAllBrandsByProductIds([1, 2, 3])).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMockService.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2, 3] } },
        include: { brand: true },
      });
    });

    it('should return brands in the same order as requested product IDs', async () => {
      const productIds = [2, 1];
      prismaMockService.product.findMany.mockResolvedValueOnce(brandProductsMock);

      const result = await service.getAllBrandsByProductIds(productIds);

      expect(result).toEqual([brandMock2, brandMock1]);
    });

    it('should handle empty product IDs array', async () => {
      const productIds: number[] = [];
      prismaMockService.product.findMany.mockResolvedValueOnce([]);

      const result = await service.getAllBrandsByProductIds(productIds);

      expect(result).toEqual([]);
      expect(prismaMockService.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: productIds } },
        include: { brand: true },
      });
    });
  });
});
