import { registerEnumType } from '@nestjs/graphql';

export enum StatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(StatusEnum, {
  name: 'StatusEnum',
});
