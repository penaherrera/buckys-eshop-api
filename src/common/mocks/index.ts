import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UsersService } from '../../users/services/users.service';
import { VariantsService } from 'src/variants/services/variants.service';
import { EmailService } from 'src/email/email.service';

export const createUsersMockService = (): DeepMockProxy<UsersService> =>
  mockDeep<UsersService>();

export const createJwtMockService = (): DeepMockProxy<JwtService> =>
  mockDeep<JwtService>();

export const createPrismaMockService = (): DeepMockProxy<PrismaClient> =>
  mockDeep<PrismaClient>();

export const createVariantsMockService = (): DeepMockProxy<VariantsService> =>
  mockDeep<VariantsService>();

export const createEmailMockService = (): DeepMockProxy<EmailService> =>
  mockDeep<EmailService>();
