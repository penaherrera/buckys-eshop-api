import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Variant } from '@prisma/client';
import { ProductEntity } from '../../products/entities/product.entity';
import { Size } from '../enums/size.enum';

registerEnumType(Size, {
  name: 'Size',
});

@ObjectType()
export class VariantEntity implements Variant {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Number)
  readonly productId: number;

  @Field(() => Number)
  readonly stock: number;

  @Field(() => String)
  readonly color: string;

  @Field(() => Size)
  readonly size: Size;

  @Field(() => ProductEntity)
  readonly product: ProductEntity;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;
}
