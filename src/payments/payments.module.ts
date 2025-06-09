import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrdersService } from '../orders/services/orders.service';
import { ConfigModule } from '@nestjs/config';
import paymentsConfig from './config/payments.config';

@Module({
  imports: [ConfigModule.forFeature(paymentsConfig)],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, OrdersService],
})
export class PaymentsModule {}
