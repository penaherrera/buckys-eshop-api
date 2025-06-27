import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrdersService } from '../orders/services/orders.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, OrdersService],
})
export class PaymentsModule {}
