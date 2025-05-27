import { InputType, Field, Int } from '@nestjs/graphql';
import { GenderEnum } from '../enums/gender.enum';
import { IsEnum, IsInt, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ClothingTypeEnum } from '../enums/clothing-type.enum';

@InputType()
export class CreateProductInput {
  @Field(() => Int, { description: 'Category of the product' })
  @IsInt()
  categoryId: number;

  @Field(() => Int, { description: 'Brand of the product' })
  @IsInt()
  brandId: number;

  @Field(() => String, { description: 'Product name' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Product description' })
  @IsString()
  description: string;

  @Field(() => Number, { description: 'Product price' })
  @IsNumber()
  price: number;

  @Field(() => Boolean, {
    description: 'Product is active or not',
    nullable: true,
    defaultValue: true,
  })
  @IsBoolean()
  isActive?: boolean;

  @Field(() => Boolean, {
    description: 'Shows if product is in stock',
    nullable: true,
    defaultValue: true,
  })
  @IsBoolean()
  inStock?: boolean;

  @Field(() => ClothingTypeEnum, {
    description: 'Clothing type of the product',
    nullable: true,
    defaultValue: ClothingTypeEnum.CLOTHING,
  })
  @IsEnum(ClothingTypeEnum)
  clothingType?: ClothingTypeEnum;

  @Field(() => GenderEnum, {
    description: 'Product gender',
    nullable: true,
    defaultValue: GenderEnum.UNISEX,
  })
  @IsEnum(GenderEnum)
  gender?: GenderEnum;
}
