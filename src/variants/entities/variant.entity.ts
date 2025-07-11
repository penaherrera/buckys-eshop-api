import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Variant } from '@prisma/client';
import { SizeEnum } from '../enums/size.enum';
import { ProductEntity } from '../../products/entities/product.entity';

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

  @Field(() => ProductEntity)
  readonly product?: ProductEntity;
}
