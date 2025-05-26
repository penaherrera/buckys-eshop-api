import { Module } from '@nestjs/common';
import { CategoriesService } from '../categories/services/categories.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DataloaderService } from './services/dataloader.service';

@Module({
  providers: [CategoriesService, PrismaService, DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
