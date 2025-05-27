import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/services/categories.service';
import { BrandsService } from '../brands/services/brands.service';
import { VariantsService } from '../variants/services/variants.service';

@Module({
  providers: [
    ProductsResolver,
    ProductsService,
    PrismaService,
    CategoriesService,
    BrandsService,
    VariantsService,
  ],
})
export class ProductsModule {}
