import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { CartDto } from '../../carts/dtos/cart.dto';
import { VariantDto } from '../../variants/dtos/responses/variant.dto';

@ObjectType()
export class CartProductDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => Int)
  @Expose()
  variantId: number;

  @Field(() => Int)
  @Expose()
  cartId: number;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;
}
