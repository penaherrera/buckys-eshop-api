import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UsersService } from '../../users/services/users.service';
import { VariantsService } from '../../variants/services/variants.service';
import { EmailService } from '../../email/services/email.service';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OrdersService } from '../../orders/services/orders.service';
import { StripeService } from '../../stripe/services/stripe.service';
import { SendGridClient } from '../../email/sendgrid-client';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';

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

export const createStripeMockService = (): DeepMockProxy<StripeService> =>
  mockDeep<StripeService>();

export const createSendgridMockClient = (): DeepMockProxy<SendGridClient> =>
  mockDeep<SendGridClient>();

export const createCloudinaryMockService =
  (): DeepMockProxy<CloudinaryService> => mockDeep<CloudinaryService>();
