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

  @Field(() => VariantDto, { nullable: true })
  @Expose()
  variant?: VariantDto;

  @Field(() => CartDto, { nullable: true })
  @Expose()
  cart?: CartDto;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;
}
