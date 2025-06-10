import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { ProductDto } from '../../products/dtos/responses/product.dto';

@ObjectType()
export class LikeDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => Int)
  @Expose()
  productId: number;

  @Field(() => Int)
  @Expose()
  userId: number;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => ProductDto, { nullable: true })
  @Expose()
  product?: ProductDto;
}
