import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './services/orders.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphQlExceptionFilter } from '../common/filters/graphql-exception.filter';
import { AdminGuard } from '../common/guards/admin.guard';

@UseFilters(GraphQlExceptionFilter)
@UseGuards(JwtAuthGuard)
@Resolver(() => OrderEntity)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AdminGuard)
  @Query(() => [OrderEntity], {
    name: 'allOrders',
    description: 'Admin Query: retrieve all existing orders',
  })
  getAllOrders(): Promise<OrderEntity[]> {
    return this.ordersService.getAllOrders();
  }
}
