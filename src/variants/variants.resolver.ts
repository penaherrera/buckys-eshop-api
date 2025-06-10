import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { VariantEntity } from './entities/variant.entity';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GraphQlExceptionFilter } from '../common/filters/graphql-exception.filter';
import { ProductEntity } from '../products/entities/product.entity';
import { IDataloaders } from '../dataloader/interfaces/dataloader.interface';

@UseFilters(GraphQlExceptionFilter)
@UseGuards(JwtAuthGuard)
@Resolver(() => VariantEntity)
export class VariantsResolver {
  @ResolveField('product', () => ProductEntity)
  getProducts(
    @Parent() variant: VariantEntity,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    return loaders.productsLoader.load(variant.id);
  }
}
