import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { OrderDto } from '../../orders/dtos/order.dto';

@ObjectType()
export class TransactionDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => Int)
  @Expose()
  orderId: number;

  @Field(() => Int)
  @Expose()
  amount: number;

  @Field(() => String)
  @Expose()
  stripeChargeId: string;

  @Field(() => String)
  @Expose()
  receiptUrl: string;

  @Field(() => String)
  @Expose()
  currency: string;

  @Field(() => String)
  @Expose()
  stripeStatus: string;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => OrderDto)
  @Expose()
  order: OrderDto;
}
