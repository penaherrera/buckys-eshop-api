import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { ProductDto } from '../../products/dtos/responses/product.dto';

@ObjectType()
export class CategoryDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => String)
  @Expose()
  name: string;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Expose()
  updatedAt: Date;

  @Field(() => [ProductDto], { nullable: true })
  @Expose()
  products?: ProductDto[];
}
