import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Transaction } from '@prisma/client';
import { OrderEntity } from '../../orders/entities/order.entity';

@ObjectType()
export class TransactionEntity implements Transaction {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Int)
  readonly orderId: number;

  @Field(() => Int)
  readonly amount: number;

  @Field(() => String)
  readonly stripeChargeId: string;

  @Field(() => String)
  readonly receiptUrl: string;

  @Field(() => String)
  readonly currency: string;

  @Field(() => String)
  readonly stripeStatus: string;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;

  @Field(() => OrderEntity)
  readonly order: OrderEntity;
}
