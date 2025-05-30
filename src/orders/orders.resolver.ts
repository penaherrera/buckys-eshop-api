import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './services/orders.service';
import { UserEntity } from '../users/entities/user.entity';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GetUser } from '../users/decorators/get-user.decorator';
import { GraphQlExceptionFilter } from '../common/filters/graphql-exception.filter';

@UseFilters(GraphQlExceptionFilter)
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
