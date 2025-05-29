import { Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { CheckoutDto } from '../dtos/checkout.dto';
import { Headers } from '@nestjs/common';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  createPaymentIntent(@Body() checkoutDto: CheckoutDto) {
    return this.paymentsService.createPaymentIntent(checkoutDto);
  }

  @Post('webhook')
  stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    this.paymentsService.handleWebhook(req.rawBody, signature);
  }
}
