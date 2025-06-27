import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, IsEnum } from 'class-validator';
import { SizeEnum } from '../enums/size.enum';

@InputType()
export class CreateVariantInput {
  @Field(() => Int, { description: 'Product Id', nullable: true })
  productId?: number;

  @Field(() => Int, { description: 'Stock quantity' })
  @IsInt()
  stock: number;

  @Field(() => String, { description: 'Variant color' })
  @IsString()
  color: string;

  @Field(() => SizeEnum, {
    description: 'Variant size',
    nullable: true,
    defaultValue: SizeEnum.MEDIUM,
  })
  @IsEnum(SizeEnum)
  size?: SizeEnum;
}
