import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrdersService } from '../orders/services/orders.service';
import { StripeService } from '../stripe/services/stripe.service';
import stripeConfig from '../stripe/config/stripe.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(stripeConfig)],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, OrdersService, StripeService],
})
export class PaymentsModule {}
