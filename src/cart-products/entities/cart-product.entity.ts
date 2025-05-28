import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { CartProducts } from '@prisma/client';
import { CartEntity } from 'src/carts/entities/cart.entity';
import { VariantEntity } from 'src/variants/entities/variant.entity';

@ObjectType()
export class CartProductEntity implements CartProducts {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Number)
  readonly variantId: number;

  @Field(() => Number)
  readonly cartId: number;

  @Field(() => VariantEntity, { nullable: true })
  readonly variant: VariantEntity;

  @Field(() => CartEntity, { nullable: true })
  readonly cart?: CartEntity;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;
}
