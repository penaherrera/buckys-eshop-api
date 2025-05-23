import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Brand } from '@prisma/client';
import { ProductEntity } from '../../products/entities/product.entity';

@ObjectType()
export class BrandEntity implements Brand {
  @Field(() => ID)
  readonly id: number;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly description: string;

  @Field(() => Boolean)
  readonly isActive: boolean;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;

  @Field(() => [ProductEntity], { nullable: true })
  readonly products?: ProductEntity[];
}
