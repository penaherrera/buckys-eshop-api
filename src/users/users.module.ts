import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { UsersResolver } from './resolvers/users.resolver';
import { CartsService } from '../carts/services/carts.service';
import { LikesService } from '../likes/services/likes.service';
import { OrdersService } from '../orders/services/orders.service';

@Module({
  providers: [
    UsersService,
    PrismaService,
    UsersResolver,
    CartsService,
    LikesService,
    OrdersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
