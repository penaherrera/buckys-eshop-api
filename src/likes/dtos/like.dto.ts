import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { ProductDto } from '../../products/dtos/responses/product.dto';

@ObjectType()
export class LikeDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => ID)
  @Expose()
  productId: number;

  @Field(() => ID)
  @Expose()
  userId: number;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => ProductDto, { nullable: true })
  @Expose()
  product?: ProductDto;
}
