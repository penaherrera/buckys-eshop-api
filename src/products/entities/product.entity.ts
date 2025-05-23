import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product } from '@prisma/client';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { CategoryEntity } from '../../categories/entitites/category.entity';
import { DetailEntity } from '../../details/entities/detail.entity';
import { ProductTypeEntity } from '../../product-types/entities/product-type.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { Gender } from '../enums/gender.enum';

registerEnumType(Gender, {
  name: 'Gender',
});

@ObjectType()
export class ProductEntity implements Product {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Number)
  readonly categoryId: number;

  @Field(() => Number)
  readonly brandId: number;

  @Field(() => Number)
  readonly productTypeId: number;

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

  @Field(() => Gender)
  readonly gender: Gender;

  @Field(() => CategoryEntity)
  readonly category: CategoryEntity;

  @Field(() => BrandEntity)
  readonly brand: BrandEntity;

  @Field(() => ProductTypeEntity)
  readonly productType: ProductTypeEntity;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;

  @Field(() => Date, { nullable: true })
  readonly deletedAt: Date | null;

  @Field(() => [DetailEntity], { nullable: true })
  readonly details?: DetailEntity[];
}
