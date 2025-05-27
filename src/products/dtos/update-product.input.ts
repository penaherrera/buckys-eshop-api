import { IsInt, IsOptional } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true, description: 'Category of the product' })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @Field(() => Int, { nullable: true, description: 'Brand of the product' })
  @IsOptional()
  @IsInt()
  brandId?: number;
}
