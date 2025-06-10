import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhook: process.env.STRIPE_WEBHOOK || '',
}));
