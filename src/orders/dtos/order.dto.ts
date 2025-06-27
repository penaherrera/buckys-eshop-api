import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { StatusEnum } from '../enums/status.enum';
import { CartDto } from '../../carts/dtos/cart.dto';
import { TransactionDto } from '../../transactions/dtos/transaction.dto';

registerEnumType(StatusEnum, {
  name: 'StatusEnum',
});

@ObjectType()
export class OrderDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => Int)
  @Expose()
  cartId: number;

  @Field(() => StatusEnum)
  @Expose()
  status: StatusEnum;

  @Field(() => String)
  @Expose()
  stripePaymentIntentId: string;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => CartDto)
  @Expose()
  cart?: CartDto;

  @Field(() => [TransactionDto], { nullable: true })
  @Expose()
  transactions?: TransactionDto[];
}
