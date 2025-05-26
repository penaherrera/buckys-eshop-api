import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriesService } from 'src/categories/services/categories.service';

@Module({
  providers: [
    ProductsResolver,
    ProductsService,
    PrismaService,
    CategoriesService,
  ],
})
export class ProductsModule {}
