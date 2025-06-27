import { Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigType } from '@nestjs/config';
import stripeConfig from '../config/stripe.config';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    @Inject(stripeConfig.KEY)
    private readonly stripeConfiguration: ConfigType<typeof stripeConfig>,
  ) {
    this.stripe = new Stripe(stripeConfiguration.stripeSecretKey);
  }

  async createPaymentIntent(amount, currency): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
    });

    return paymentIntent;
  }

  async constructEvent(rawBody, signature: string): Promise<Stripe.Event> {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.stripeConfiguration.stripeWebhook,
    );
    this.logger.log('Stripe Webhook Event Received:', event.type);

    return event;
  }
}
