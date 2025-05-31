import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsResolver } from './products.resolver';
import { PrismaService } from '../common/prisma/prisma.service';
import { CategoriesService } from '../categories/services/categories.service';
import { BrandsService } from '../brands/services/brands.service';
import { VariantsService } from '../variants/services/variants.service';
import { LikesService } from '../likes/services/likes.service';

@Module({
  providers: [
    ProductsResolver,
    ProductsService,
    PrismaService,
    CategoriesService,
    BrandsService,
    VariantsService,
    LikesService,
  ],
})
export class ProductsModule {}
