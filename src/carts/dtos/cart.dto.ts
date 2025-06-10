import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { CartProductDto } from '../../cart-products/dtos/cart-product.dto';
import { UserDto } from '../../users/dtos/responses/user.dto';

@ObjectType()
export class CartDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => Int)
  @Expose()
  userId: number;

  @Field(() => UserDto)
  @Expose()
  user?: UserDto;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Expose()
  updatedAt: Date;

  @Field(() => [CartProductDto], { nullable: true })
  @Expose()
  cartProducts?: CartProductDto[];
}
