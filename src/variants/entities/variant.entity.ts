import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Variant } from '@prisma/client';
import { ProductEntity } from '../../products/entities/product.entity';
import { SizeEnum } from '../enums/size.enum';

registerEnumType(SizeEnum, {
  name: 'SizeEnum',
});

@ObjectType()
export class VariantEntity implements Variant {
  @Field(() => Int)
  readonly id: number;

  @Field(() => Int)
  readonly productId: number;

  @Field(() => Int)
  readonly stock: number;

  @Field(() => String)
  readonly color: string;

  @Field(() => SizeEnum)
  readonly size: SizeEnum;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: Date;
}
