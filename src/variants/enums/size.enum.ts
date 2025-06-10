import { registerEnumType } from '@nestjs/graphql';

export enum SizeEnum {
  EXTRA_SMALL = 'EXTRA_SMALL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  EXTRA_LARGE = 'EXTRA_LARGE',
}

registerEnumType(SizeEnum, {
  name: 'SizeEnum',
});
