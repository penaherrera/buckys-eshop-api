import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CategoriesService } from './categories.service';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import {
  categoryMock1,
  categoryMock2,
  categoryProductsMock,
} from '../../common/mocks/mock';
import { createPrismaMockService } from '../../common/mocks';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaMockService = createPrismaMockService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('getAllCategoriesByProductIds', () => {
    it('should return categories for all product IDs', async () => {
      const productIds = [1, 2];
      prismaMockService.product.findMany.mockResolvedValue(
        categoryProductsMock,
      );

      const result = await service.getAllCategoriesByProductIds(productIds);

      expect(prismaMockService.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: productIds } },
        include: { category: true },
      });
      expect(result).toEqual([categoryMock1, categoryMock2]);
    });

    it('should throw NotFoundException if any product has no category', async () => {
      const productIds = [1, 2, 3];
      const productsWithMissingCategory = [
        ...categoryProductsMock,
        {
          ...categoryProductsMock[0],
          id: 3,
          category: null,
        },
      ];
      prismaMockService.product.findMany.mockResolvedValue(
        productsWithMissingCategory,
      );

      await expect(
        service.getAllCategoriesByProductIds(productIds),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMockService.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: productIds } },
        include: { category: true },
      });
    });

    it('should return categories in the same order as requested product IDs', async () => {
      const productIds = [2, 1];
      prismaMockService.product.findMany.mockResolvedValue(
        categoryProductsMock,
      );

      const result = await service.getAllCategoriesByProductIds(productIds);

      expect(result).toEqual([categoryMock2, categoryMock1]);
    });

    it('should handle empty product IDs array', async () => {
      const productIds: number[] = [];
      prismaMockService.product.findMany.mockResolvedValue([]);

      const result = await service.getAllCategoriesByProductIds(productIds);

      expect(result).toEqual([]);
      expect(prismaMockService.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: productIds } },
        include: { category: true },
      });
    });
  });
});
