import { registerEnumType } from '@nestjs/graphql';

export enum ClothingTypeEnum {
  CLOTHING = 'CLOTHING',
  TSHIRT = 'TSHIRT',
  FOOTWEAR = 'FOOTWEAR',
  PANTS = 'PANTS',
  HAT = 'HAT',
}

registerEnumType(ClothingTypeEnum, {
  name: 'ClothingTypeEnum',
});
