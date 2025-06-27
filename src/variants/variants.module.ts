import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { VariantsService } from './services/variants.service';
import { VariantsResolver } from './variants.resolver';
import { ProductsService } from '../products/services/products.service';

@Module({
  providers: [
    VariantsService,
    PrismaService,
    VariantsResolver,
    ProductsService,
  ],
  exports: [VariantsService],
})
export class VariantsModule {}
