import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Order, Status } from '@prisma/client';
import { CartEntity } from '../../carts/entities/cart.entity';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

@ObjectType()
export class OrderEntity implements Order {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Int)
  readonly cartId: number;

  @Field(() => String)
  readonly status: Status;

  @Field(() => String)
  readonly stripePaymentIntendId: string;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;

  @Field(() => CartEntity)
  readonly cart?: CartEntity;

  @Field(() => [TransactionEntity], { nullable: true })
  readonly transactions?: TransactionEntity[];
}
