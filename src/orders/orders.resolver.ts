import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './services/orders.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GetUser } from 'src/users/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Resolver(() => OrderEntity)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [OrderEntity], { name: 'userOrders' })
  async getUserOrders(
    @GetUser() user: UserEntity,
  ): Promise<OrderEntity[] | null> {
    return this.ordersService.getUserOrders(user.id);
  }
}
