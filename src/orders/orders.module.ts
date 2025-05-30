import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrdersResolver } from './orders.resolver';

@Module({
  providers: [OrdersService, OrdersResolver, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
