import {
  likeMock,
  likesMock,
  loggerMock,
  productMock,
  userMock,
} from '../../common/mocks/mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConsoleLogger, NotFoundException } from '@nestjs/common';
import { createPrismaMockService } from '../../common/mocks';
import { LikesService } from './likes.service';
import { LikeEntity } from '../entities/like.entity';

describe('LikesService', () => {
  let service: LikesService;
  let prismaMockService;

  beforeEach(async () => {
    prismaMockService = createPrismaMockService();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    })
      .setLogger(loggerMock as unknown as ConsoleLogger)
      .compile();

    service = module.get<LikesService>(LikesService);
  });

  describe('getUserLikes', () => {
    it('should return all likes from an user', async () => {
      prismaMockService.like.findMany.mockResolvedValueOnce(likesMock);

      const result = await service.getUserLikes(userMock.id);

      expect(result).toHaveLength(1);
      expect(result).toBeInstanceOf(Array);
      expect(prismaMockService.like.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMockService.like.findMany).toHaveBeenCalledWith({
        where: { userId: userMock.id },
        orderBy: { createdAt: 'desc' },
        select: { product: true },
      });
    });

    it('should return null when user has no likes', async () => {
      prismaMockService.like.findMany.mockResolvedValueOnce([]);

      const result = await service.getUserLikes(userMock.id);

      expect(result).toBeNull();
      expect(prismaMockService.like.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMockService.like.findMany).toHaveBeenCalledWith({
        where: { userId: userMock.id },
        orderBy: { createdAt: 'desc' },
        select: { product: true },
      });
    });
  });

  describe('toggleLike', () => {
    it('should create a new like when user has not liked the product', async () => {
      prismaMockService.product.findUnique.mockResolvedValueOnce(productMock);
      prismaMockService.like.findFirst.mockResolvedValueOnce(null);
      prismaMockService.like.create.mockResolvedValueOnce(likeMock);

      const result = await service.toggleLike(userMock.id, productMock.id);

      expect(result).toBeInstanceOf(LikeEntity);

      expect(result).toEqual(
        expect.objectContaining({
          id: likeMock.id,
          userId: likeMock.userId,
          productId: likeMock.productId,
        }),
      );

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productMock.id },
      });

      expect(prismaMockService.like.findFirst).toHaveBeenCalledWith({
        where: {
          userId: userMock.id,
          productId: productMock.id,
        },
      });

      expect(prismaMockService.like.create).toHaveBeenCalledWith({
        data: {
          userId: userMock.id,
          productId: productMock.id,
        },
      });

      expect(prismaMockService.like.delete).not.toHaveBeenCalled();
    });

    it('should remove existing like when user has already liked the product', async () => {
      prismaMockService.product.findUnique.mockResolvedValueOnce(productMock);
      prismaMockService.like.findFirst.mockResolvedValueOnce(likeMock);
      prismaMockService.like.delete.mockResolvedValueOnce(likeMock);

      const result = await service.toggleLike(userMock.id, productMock.id);

      expect(result).toBeNull();

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productMock.id },
      });

      expect(prismaMockService.like.findFirst).toHaveBeenCalledWith({
        where: {
          userId: userMock.id,
          productId: productMock.id,
        },
      });

      expect(prismaMockService.like.delete).toHaveBeenCalledWith({
        where: {
          id: likeMock.id,
        },
      });

      expect(prismaMockService.like.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if product does not exist', async () => {
      prismaMockService.product.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.toggleLike(userMock.id, productMock.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productMock.id },
      });

      expect(prismaMockService.like.findFirst).not.toHaveBeenCalled();
      expect(prismaMockService.like.create).not.toHaveBeenCalled();
      expect(prismaMockService.like.delete).not.toHaveBeenCalled();
    });
  });
});
