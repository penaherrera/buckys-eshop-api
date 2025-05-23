import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProductType } from '@prisma/client';
import { ProductEntity } from '../../products/entities/product.entity';

@ObjectType()
export class ProductTypeEntity implements ProductType {
  @Field(() => ID)
  readonly id: number;

  @Field(() => String)
  readonly name: string;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;

  @Field(() => [ProductEntity], { nullable: true })
  readonly products?: ProductEntity[];
}
