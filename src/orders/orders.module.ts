import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
