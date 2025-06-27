import { Field, ObjectType } from '@nestjs/graphql';
import { ProductDto } from './product.dto';
import { PaginationMetadata } from '../../../common/pagination/pagination.type';

@ObjectType()
export class PaginatedProductsDto {
  @Field(() => [ProductDto])
  data: ProductDto[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
