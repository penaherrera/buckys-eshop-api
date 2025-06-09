import { registerAs } from '@nestjs/config';

export default registerAs('payments', () => ({
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhook: process.env.STRIPE_WEBHOOK || '',
}));
