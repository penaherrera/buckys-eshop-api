import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConsoleLogger, NotFoundException } from '@nestjs/common';
import { createPrismaMockService } from '../../common/mocks';
import {
  orderMock,
  cartMock,
  ordersMock,
  loggerMock,
} from '../../common/mocks/mock';
import { OrderEntity } from '../entities/order.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaMockService = createPrismaMockService();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    })
      .setLogger(loggerMock as unknown as ConsoleLogger)
      .compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('create', () => {
    const cartId = 1;
    const paymentIntentId = 'pi_test_123';

    it('should create an order when cart exists', async () => {
      prismaMockService.cart.findUnique.mockResolvedValueOnce(cartMock);
      prismaMockService.order.create.mockResolvedValueOnce(orderMock);

      const result = await service.create(cartId, paymentIntentId);

      expect(prismaMockService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: cartId },
      });
      expect(prismaMockService.order.create).toHaveBeenCalledWith({
        data: { cartId, stripePaymentIntendId: paymentIntentId },
      });
      expect(result).toEqual(orderMock);
    });

    it('should throw NotFoundException when cart does not exist', async () => {
      prismaMockService.cart.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(cartId, paymentIntentId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaMockService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: cartId },
      });
      expect(prismaMockService.order.create).not.toHaveBeenCalled();
    });
  });

  describe('findByPaymentIntent', () => {
    const paymentIntentId = 'pi_test_123';

    it('should return an order if found', async () => {
      prismaMockService.order.findFirst.mockResolvedValueOnce(orderMock);

      const result = await service.findByPaymentIntent(paymentIntentId);

      expect(prismaMockService.order.findFirst).toHaveBeenCalledWith({
        where: { stripePaymentIntendId: paymentIntentId },
      });
      expect(result).toEqual(orderMock);
    });

    it('should throw NotFoundException if order not found', async () => {
      prismaMockService.order.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.findByPaymentIntent(paymentIntentId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserOrders', () => {
    const userId = 1;

    it('should return transformed user orders', async () => {
      prismaMockService.order.findMany.mockResolvedValueOnce(ordersMock);

      const result = await service.getUserOrders(userId);

      expect(prismaMockService.order.findMany).toHaveBeenCalledWith({
        where: { cart: { userId } },
        orderBy: { createdAt: 'desc' },
        include: {
          transactions: true,
          cart: {
            include: {
              cartProducts: {
                include: {
                  variant: { include: { product: true } },
                },
              },
            },
          },
        },
      });

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(OrderEntity);
    });
  });

  describe('getAllOrders', () => {
    it('should return transformed orders with user data', async () => {
      prismaMockService.order.findMany.mockResolvedValueOnce(ordersMock);

      const result = await service.getAllOrders();

      expect(prismaMockService.order.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        include: {
          transactions: true,
          cart: {
            include: {
              user: true,
              cartProducts: {
                include: {
                  variant: { include: { product: true } },
                },
              },
            },
          },
        },
      });

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(OrderEntity);
    });
  });
});
