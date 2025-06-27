import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Like } from '@prisma/client';
import { ProductEntity } from '../../products/entities/product.entity';

@ObjectType()
export class LikeEntity implements Like {
  @Field(() => Int)
  readonly id: number;

  @Field(() => Int)
  readonly productId: number;

  @Field(() => Int)
  readonly userId: number;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;

  @Field(() => [ProductEntity], { nullable: true })
  readonly products?: ProductEntity[];
}
