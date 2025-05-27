import { Module } from '@nestjs/common';
import { CategoriesService } from '../categories/services/categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { DataloaderService } from './services/dataloader.service';
import { BrandsService } from '../brands/services/brands.service';
import { VariantsService } from '../variants/services/variants.service';

@Module({
  providers: [
    CategoriesService,
    BrandsService,
    VariantsService,
    PrismaService,
    DataloaderService,
  ],
  exports: [DataloaderService],
})
export class DataloaderModule {}
