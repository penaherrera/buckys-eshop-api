import { Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { ConfigModule } from '@nestjs/config';
import stripeConfig from './config/stripe.config';

@Module({
  imports: [ConfigModule.forFeature(stripeConfig)],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
