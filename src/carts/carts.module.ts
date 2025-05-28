import { Module } from '@nestjs/common';
import { CartsService } from './services/carts.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [CartsService, PrismaService],
  exports: [CartsService],
})
export class CartsModule {}
