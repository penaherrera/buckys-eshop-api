import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { ProductDto } from '../../../products/dtos/responses/product.dto';
import { SizeEnum } from '../../../variants/enums/size.enum';

@ObjectType()
export class VariantDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => ID)
  @Expose()
  productId: number;

  @Field(() => Int)
  @Expose()
  stock: number;

  @Field(() => String)
  @Expose()
  color: string;

  @Field(() => SizeEnum)
  @Expose()
  size: SizeEnum;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Expose()
  updatedAt: Date;

  @Field(() => ProductDto, { nullable: true })
  @Expose()
  product?: ProductDto;
}
