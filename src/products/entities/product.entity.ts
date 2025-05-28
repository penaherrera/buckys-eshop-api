import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Product } from '@prisma/client';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { CategoryEntity } from '../../categories/entitites/category.entity';
import { VariantEntity } from '../../variants/entities/variant.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { GenderEnum } from '../enums/gender.enum';
import { ClothingTypeEnum } from '../enums/clothing-type.enum';

registerEnumType(GenderEnum, {
  name: 'GenderEnum',
});

registerEnumType(ClothingTypeEnum, {
  name: 'ClothingTypeEnum',
});
@ObjectType()
export class ProductEntity implements Product {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Number)
  readonly categoryId: number;

  @Field(() => Number)
  readonly brandId: number;

  @Field(() => Boolean)
  readonly isActive: boolean;

  @Field(() => Boolean)
  readonly inStock: boolean;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly description: string;

  @Field(() => Number)
  readonly price: Decimal;

  @Field(() => GenderEnum)
  readonly gender: GenderEnum;

  @Field(() => ClothingTypeEnum)
  readonly clothingType: ClothingTypeEnum;

  @Field(() => CategoryEntity)
  readonly category?: CategoryEntity;

  @Field(() => BrandEntity)
  readonly brand?: BrandEntity;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  readonly deletedAt: Date | null;

  @Field(() => [VariantEntity], { nullable: true })
  readonly variants?: VariantEntity[];
}
