import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Detail } from '@prisma/client';
import { ProductEntity } from '../../products/entities/product.entity';
import { Size } from '../enums/size.enum';

registerEnumType(Size, {
  name: 'Size',
});

@ObjectType()
export class DetailEntity implements Detail {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Number)
  readonly productId: number;

  @Field(() => Number)
  readonly stock: number;

  @Field(() => String)
  readonly name: string;

  @Field(() => Size)
  readonly size: Size;

  @Field(() => ProductEntity)
  readonly product: ProductEntity;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;
}
