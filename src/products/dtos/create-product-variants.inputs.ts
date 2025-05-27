import { Field, InputType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { CreateVariantInput } from 'src/variants/dtos/create-variant.input';

@InputType()
export class CreateProductWithVariantsInput {
  @Field(() => CreateProductInput)
  product: CreateProductInput;

  @Field(() => [CreateVariantInput])
  variants: CreateVariantInput[];
}
