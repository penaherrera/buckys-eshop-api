import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Cart } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';
import { CartProductEntity } from '../../cart-products/entities/cart-product.entity';

@ObjectType()
export class CartEntity implements Cart {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Number)
  readonly userId: number;

  @Field(() => UserEntity)
  readonly user?: UserEntity;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: Date;

  @Field(() => [CartProductEntity], { nullable: true })
  readonly cartProducts?: CartProductEntity[];
}
