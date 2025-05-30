import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { UsersResolver } from './resolvers/users.resolver';
import { CartsService } from '../carts/services/carts.service';

@Module({
  providers: [UsersService, PrismaService, UsersResolver, CartsService],
  exports: [UsersService],
})
export class UsersModule {}
