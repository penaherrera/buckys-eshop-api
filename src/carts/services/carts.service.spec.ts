import { createPrismaMockService } from '../../common/mocks';
import { CartsService } from './carts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConsoleLogger, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { cartMock, loggerMock } from '../../common/mocks/mock';

describe('CartsService - getUserLastCart', () => {
  let service: CartsService;
  let prismaMockService;

  beforeEach(async () => {
    prismaMockService = createPrismaMockService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: PrismaService, useValue: prismaMockService },
      ],
    })
      .setLogger(loggerMock as unknown as ConsoleLogger)
      .compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should return user cart when found', async () => {
    prismaMockService.cart.findFirst.mockResolvedValue(cartMock);

    const result = await service.getUserLastCart(1);

    expect(result).toBeDefined();
    expect(prismaMockService.cart.findFirst).toHaveBeenCalledTimes(1);
    expect(result!.id).toBe(1);
    expect(result!.userId).toBe(1);
  });

  it('should throw NotFoundException when no cart exists', async () => {
    prismaMockService.cart.findFirst.mockResolvedValue(null);

    await expect(service.getUserLastCart(1)).rejects.toThrow(NotFoundException);
  });

  it('should call prisma with correct parameters', async () => {
    prismaMockService.cart.findFirst.mockResolvedValue(cartMock);

    await service.getUserLastCart(1);

    expect(prismaMockService.cart.findFirst).toHaveBeenCalledWith({
      where: { userId: 1 },
      include: {
        cartProducts: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'asc' },
    });
  });
});
