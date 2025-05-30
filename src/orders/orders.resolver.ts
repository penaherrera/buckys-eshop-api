import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './services/orders.service';
import { UserEntity } from '../users/entities/user.entity';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GetUser } from '../users/decorators/get-user.decorator';
import { GraphQlExceptionFilter } from '../common/filters/graphql-exception.filter';
import { AdminGuard } from '../common/guards/admin.guard';
import { OrderDto } from './dtos/order.dto';

@UseFilters(GraphQlExceptionFilter)
@UseGuards(JwtAuthGuard)
@Resolver(() => OrderEntity)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [OrderEntity], {
    name: 'myOrders',
    description: 'Retrieve orders from current user',
  })
  getUserOrders(@GetUser() user: UserEntity): Promise<OrderDto[] | null> {
    return this.ordersService.getUserOrders(user.id);
  }

  @UseGuards(AdminGuard)
  @Query(() => [OrderEntity], {
    name: 'allOrders',
    description: 'Admin Query: retrieve all existing orders',
  })
  getAllOrders(): Promise<OrderDto[]> {
    return this.ordersService.getAllOrders();
  }
}
