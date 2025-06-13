import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadata } from '../../../common/pagination/pagination.type';
import { ProductEntity } from '../../../products/entities/product.entity';

@ObjectType()
export class PaginatedProductsDto {
  @Field(() => [ProductEntity])
  data: ProductEntity[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
