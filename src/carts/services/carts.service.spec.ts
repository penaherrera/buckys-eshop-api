import { createPrismaMockService } from '../../common/mocks';
import { CartsService } from './carts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConsoleLogger, NotFoundException } from '@nestjs/common';
import { cartDtoMock, cartMock, loggerMock } from '../../common/mocks/mock';

describe('CartsService', () => {
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
    prismaMockService.cart.findFirst.mockResolvedValueOnce(cartDtoMock);

    const result = await service.getUserLastCart(1);

    expect(result).toBeDefined();
    expect(prismaMockService.cart.findFirst).toHaveBeenCalledTimes(1);
    expect(result!.id).toBe(1);
    expect(result!.userId).toBe(1);
  });

  it('should throw NotFoundException when no cart exists', async () => {
    prismaMockService.cart.findFirst.mockResolvedValueOnce(null);

    await expect(service.getUserLastCart(1)).rejects.toThrow(NotFoundException);
  });

  it('should call prisma with correct parameters', async () => {
    prismaMockService.cart.findFirst.mockResolvedValueOnce(cartDtoMock);

    await service.getUserLastCart(1);

    expect(prismaMockService.cart.findFirst).toHaveBeenCalledWith({
      where: { userId: 1 },
      include: {
        cartProducts: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
  });
});
