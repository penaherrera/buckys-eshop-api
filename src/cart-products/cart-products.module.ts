import { Module } from '@nestjs/common';
import { CartProductsService } from './services/cart-products.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { CartProductsResolver } from './cart-products.resolver';
import { CartsService } from '../carts/services/carts.service';

@Module({
  providers: [
    CartProductsService,
    CartProductsResolver,
    PrismaService,
    CartsService,
  ],
})
export class CartProductsModule {}
