import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
}));
