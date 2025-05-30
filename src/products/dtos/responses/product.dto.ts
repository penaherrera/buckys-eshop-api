import {
  Field,
  ID,
  ObjectType,
  GraphQLISODateTime,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import { BrandDto } from '../../../brands/dtos/brand.dto';
import { CategoryDto } from '../../../categories/dtos/category.dto';
import { ClothingTypeEnum } from '../../../products/enums/clothing-type.enum';
import { GenderEnum } from '../../../products/enums/gender.enum';
import { VariantDto } from '../../../variants/dtos/responses/variant.dto';

registerEnumType(GenderEnum, {
  name: 'GenderEnum',
});

registerEnumType(ClothingTypeEnum, {
  name: 'ClothingTypeEnum',
});

@ObjectType()
export class ProductDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => ID)
  @Expose()
  categoryId: number;

  @Field(() => ID)
  @Expose()
  brandId: number;

  @Field(() => Boolean)
  @Expose()
  isActive: boolean;

  @Field(() => Boolean)
  @Expose()
  inStock: boolean;

  @Field(() => String)
  @Expose()
  name: string;

  @Field(() => String)
  @Expose()
  description: string;

  @Field(() => Number)
  @Type(() => Number)
  @Expose()
  price: number;

  @Field(() => GenderEnum)
  @Expose()
  gender: GenderEnum;

  @Field(() => ClothingTypeEnum)
  @Expose()
  clothingType: ClothingTypeEnum;

  @Field(() => CategoryDto, { nullable: true })
  @Expose()
  category?: CategoryDto;

  @Field(() => BrandDto, { nullable: true })
  @Expose()
  brand?: BrandDto;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Expose()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Expose()
  deletedAt?: Date | null;

  @Field(() => [VariantDto], { nullable: true })
  @Expose()
  variants?: VariantDto[];
}
