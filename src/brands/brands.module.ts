import { Module } from '@nestjs/common';
import { BrandsService } from './services/brands.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BrandsService, PrismaService],
  exports: [BrandsService],
})
export class BrandsModule {}
