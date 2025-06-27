import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

export default registerAs('app', () => ({
  port: process.env.NODE_PORT || 3000,
}));
