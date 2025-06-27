import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import Stripe from 'stripe';
import { CheckoutDto } from '../dtos/checkout.dto';
import { OrdersService } from '../../orders/services/orders.service';
import { StatusEnum } from '../../orders/enums/status.enum';
import { OrderEntity } from '../../orders/entities/order.entity';
import { StripeService } from '../../stripe/services/stripe.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly ordersService: OrdersService,
    private readonly stripeService: StripeService,
  ) {}

  async createPaymentIntent(
    checkoutDto: CheckoutDto,
  ): Promise<Stripe.PaymentIntent> {
    const { currency, amount, cartId } = checkoutDto;

    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount,
        currency,
      );
      await this.ordersService.create(cartId, paymentIntent.id);
      this.logger.log(`PaymentIntent created successfully`);
      this.logger.log('Order created successfully');

      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to create PaymentIntent', error.stack);
      throw new InternalServerErrorException('Failed to process payment');
    }
  }

  async handleWebhook(rawBody, signature: string): Promise<void> {
    try {
      const event = await this.stripeService.constructEvent(rawBody, signature);

      switch (event.type) {
        case 'charge.succeeded':
          await this.handleChargeSucceeded(event.data.object);
          break;
        case 'charge.failed':
          await this.handleChargeFailed(event.data.object);
          break;
      }
    } catch (error) {
      this.logger.error('Error processing Stripe webhook:', error);
    }
  }

  private async handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
    const order = await this.getOrder(charge);

    await this.prismaService.transaction.create({
      data: {
        orderId: order.id,
        amount: charge.amount,
        stripeChargeId: charge.id,
        receiptUrl: charge.receipt_url || '',
        currency: charge.currency,
        stripeStatus: 'Succeeded',
      },
    });

    await this.prismaService.order.update({
      where: { id: order.id },
      data: { status: StatusEnum.ACTIVE },
    });

    this.logger.log(`Transaction created for successful charge ${charge.id}`);
  }

  private async handleChargeFailed(charge: Stripe.Charge): Promise<void> {
    const order = await this.getOrder(charge);

    await this.prismaService.transaction.create({
      data: {
        orderId: order.id,
        amount: charge.amount,
        stripeChargeId: charge.id,
        receiptUrl: charge.receipt_url || '',
        currency: charge.currency,
        stripeStatus: 'Failed',
      },
    });

    this.logger.warn(`Transaction created for failed charge ${charge.id}`);
  }

  private async getOrder(charge: Stripe.Charge): Promise<OrderEntity> {
    if (!charge.payment_intent) {
      this.logger.error('Charge without payment_intent:', charge.id);
      throw new BadRequestException('Missing payment_intent in charge');
    }

    const paymentIntent = charge.payment_intent.toString();
    return await this.ordersService.findByPaymentIntent(paymentIntent);
  }
}
