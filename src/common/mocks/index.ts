import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UsersService } from '../../users/services/users.service';

export const createUsersMockService = (): DeepMockProxy<UsersService> =>
  mockDeep<UsersService>();

export const createJwtMockService = (): DeepMockProxy<JwtService> =>
  mockDeep<JwtService>();

export const createPrismaMockService = (): DeepMockProxy<PrismaClient> =>
  mockDeep<PrismaClient>();
