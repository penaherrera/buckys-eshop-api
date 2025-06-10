import { registerEnumType } from '@nestjs/graphql';

export enum GenderEnum {
  UNISEX = 'UNISEX',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(GenderEnum, {
  name: 'GenderEnum',
});
