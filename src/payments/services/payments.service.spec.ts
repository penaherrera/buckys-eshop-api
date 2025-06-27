import {
  createOrdersMockService,
  createPrismaMockService,
  createStripeMockService,
} from '../../common/mocks';
import { PaymentsService } from './payments.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  chargeMock,
  loggerMock,
  orderMock,
  paymentIntentMock,
} from '../../common/mocks/mock';
import {
  ConsoleLogger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StripeService } from '../../stripe/services/stripe.service';
import { OrdersService } from '../../orders/services/orders.service';
import { CheckoutDto } from '../dtos/checkout.dto';
import { StatusEnum } from '../../orders/enums/status.enum';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaMockService;
  let stripeMockService;
  let ordersMockService;

  beforeEach(async () => {
    prismaMockService = createPrismaMockService();
    stripeMockService = createStripeMockService();
    ordersMockService = createOrdersMockService();

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
        {
          provide: StripeService,
          useValue: stripeMockService,
        },
        {
          provide: OrdersService,
          useValue: ordersMockService,
        },
      ],
    })
      .setLogger(loggerMock as unknown as ConsoleLogger)
      .compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('createPaymentIntent', () => {
    const checkoutDto: CheckoutDto = {
      amount: 2000,
      currency: 'usd',
      cartId: 1,
    };

    it('should create a payment intent successfully', async () => {
      stripeMockService.createPaymentIntent.mockResolvedValue(
        paymentIntentMock,
      );
      ordersMockService.create.mockResolvedValue(orderMock);

      const result = await service.createPaymentIntent(checkoutDto);

      expect(stripeMockService.createPaymentIntent).toHaveBeenCalledWith(
        checkoutDto.amount,
        checkoutDto.currency,
      );
      expect(ordersMockService.create).toHaveBeenCalledWith(
        checkoutDto.cartId,
        paymentIntentMock.id,
      );
      expect(result).toEqual(paymentIntentMock);
    });

    it('should throw InternalServerErrorException when stripe service fails', async () => {
      stripeMockService.createPaymentIntent.mockRejectedValue(
        new Error('Stripe error'),
      );

      await expect(service.createPaymentIntent(checkoutDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(stripeMockService.createPaymentIntent).toHaveBeenCalledWith(
        checkoutDto.amount,
        checkoutDto.currency,
      );
      expect(ordersMockService.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when order creation fails', async () => {
      stripeMockService.createPaymentIntent.mockResolvedValue(
        paymentIntentMock,
      );
      ordersMockService.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createPaymentIntent(checkoutDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(stripeMockService.createPaymentIntent).toHaveBeenCalledWith(
        checkoutDto.amount,
        checkoutDto.currency,
      );
      expect(ordersMockService.create).toHaveBeenCalledWith(
        checkoutDto.cartId,
        paymentIntentMock.id,
      );
    });
  });

  describe('handleWebhook', () => {
    const rawBody = Buffer.from('webhook body');
    const signature = 'stripe_signature';

    it('should handle charge.succeeded event', async () => {
      const event = {
        type: 'charge.succeeded',
        data: { object: chargeMock },
      };

      stripeMockService.constructEvent.mockResolvedValue(event);
      ordersMockService.findByPaymentIntent.mockResolvedValue(orderMock);
      prismaMockService.transaction.create.mockResolvedValue({});
      prismaMockService.order.update.mockResolvedValue({});

      await service.handleWebhook(rawBody, signature);

      expect(stripeMockService.constructEvent).toHaveBeenCalledWith(
        rawBody,
        signature,
      );
      expect(ordersMockService.findByPaymentIntent).toHaveBeenCalledWith(
        chargeMock.payment_intent,
      );
      expect(prismaMockService.transaction.create).toHaveBeenCalledWith({
        data: {
          orderId: orderMock.id,
          amount: chargeMock.amount,
          stripeChargeId: chargeMock.id,
          receiptUrl: chargeMock.receipt_url,
          currency: chargeMock.currency,
          stripeStatus: 'Succeeded',
        },
      });
      expect(prismaMockService.order.update).toHaveBeenCalledWith({
        where: { id: orderMock.id },
        data: { status: StatusEnum.ACTIVE },
      });
    });

    it('should handle charge.failed event', async () => {
      const event = {
        type: 'charge.failed',
        data: { object: chargeMock },
      };

      stripeMockService.constructEvent.mockResolvedValue(event);
      ordersMockService.findByPaymentIntent.mockResolvedValue(orderMock);
      prismaMockService.transaction.create.mockResolvedValue({});

      await service.handleWebhook(rawBody, signature);

      expect(stripeMockService.constructEvent).toHaveBeenCalledWith(
        rawBody,
        signature,
      );
      expect(ordersMockService.findByPaymentIntent).toHaveBeenCalledWith(
        chargeMock.payment_intent,
      );
      expect(prismaMockService.transaction.create).toHaveBeenCalledWith({
        data: {
          orderId: orderMock.id,
          amount: chargeMock.amount,
          stripeChargeId: chargeMock.id,
          receiptUrl: chargeMock.receipt_url,
          currency: chargeMock.currency,
          stripeStatus: 'Failed',
        },
      });
      expect(prismaMockService.order.update).not.toHaveBeenCalled();
    });

    it('should handle unknown event types gracefully', async () => {
      const event = {
        type: 'unknown.event',
        data: { object: {} },
      };

      stripeMockService.constructEvent.mockResolvedValue(event);

      await service.handleWebhook(rawBody, signature);

      expect(stripeMockService.constructEvent).toHaveBeenCalledWith(
        rawBody,
        signature,
      );
      expect(ordersMockService.findByPaymentIntent).not.toHaveBeenCalled();
      expect(prismaMockService.transaction.create).not.toHaveBeenCalled();
    });

    it('should handle webhook construction errors', async () => {
      stripeMockService.constructEvent.mockRejectedValue(
        new Error('Invalid signature'),
      );

      await service.handleWebhook(rawBody, signature);

      expect(stripeMockService.constructEvent).toHaveBeenCalledWith(
        rawBody,
        signature,
      );
      expect(ordersMockService.findByPaymentIntent).not.toHaveBeenCalled();
    });
  });
});
