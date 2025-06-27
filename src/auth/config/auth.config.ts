import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtExpiration: process.env.JWT_EXP || '1d',
  jwtRefreshExpiration: process.env.JWT_EXP_REFRESH || '1d',
  jwtSecret: process.env.JWT_SECRET || '',
}));
