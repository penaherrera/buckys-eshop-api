import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  providers: [UsersService, PrismaService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
