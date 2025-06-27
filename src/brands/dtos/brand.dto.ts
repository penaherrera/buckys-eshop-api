import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { ProductDto } from '../../products/dtos/responses/product.dto';

@ObjectType()
export class BrandDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => String)
  @Expose()
  name: string;

  @Field(() => String)
  @Expose()
  description: string;

  @Field(() => Boolean)
  @Expose()
  isActive: boolean;

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
