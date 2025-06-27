import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UsersService } from '../../users/services/users.service';
import { VariantsService } from '../../variants/services/variants.service';
import { EmailService } from '../../email/email.service';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import Stripe from 'stripe';
import { OrdersService } from '../../orders/services/orders.service';

export const createUsersMockService = (): DeepMockProxy<UsersService> =>
  mockDeep<UsersService>();

export const createJwtMockService = (): DeepMockProxy<JwtService> =>
  mockDeep<JwtService>();

export const createPrismaMockService = (): DeepMockProxy<PrismaClient> =>
  mockDeep<PrismaClient>();

export const createVariantsMockService = (): DeepMockProxy<VariantsService> =>
  mockDeep<VariantsService>();

export const createOrdersMockService = (): DeepMockProxy<OrdersService> =>
  mockDeep<OrdersService>();

export const createEmailMockService = (): DeepMockProxy<EmailService> =>
  mockDeep<EmailService>();

export const createMockExecutionContext = (): DeepMockProxy<ExecutionContext> =>
  mockDeep<ExecutionContext>();

export const createMockGqlContext = (): DeepMockProxy<GqlExecutionContext> =>
  mockDeep<GqlExecutionContext>();

export const createStripeMock = (): DeepMockProxy<Stripe> => mockDeep<Stripe>();
