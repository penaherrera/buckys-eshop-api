import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { UpdateUserInput } from '../dtos/requests/update-user.input';
import { UserDto } from '../dtos/responses/user.dto';
import { CartEntity } from '../../carts/entities/cart.entity';
import { CartDto } from '../../carts/dtos/cart.dto';
import { CartsService } from '../../carts/services/carts.service';
import { GraphQlExceptionFilter } from '../../common/filters/graphql-exception.filter';
import { ProductEntity } from '../../products/entities/product.entity';
import { ProductDto } from '../../products/dtos/responses/product.dto';
import { LikesService } from '../../likes/services/likes.service';
import { OrderEntity } from '../../orders/entities/order.entity';
import { OrderDto } from '../../orders/dtos/order.dto';
import { OrdersService } from '../../orders/services/orders.service';
import { CartProductEntity } from '../../cart-products/entities/cart-product.entity';
import { IDataloaders } from '../../dataloader/interfaces/dataloader.interface';

@UseFilters(GraphQlExceptionFilter)
@UseGuards(JwtAuthGuard)
@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly cartsService: CartsService,
    private readonly likesService: LikesService,
    private readonly ordersService: OrdersService,
  ) {}

  @Query(() => UserEntity, {
    name: 'me',
    description: 'Get current user information',
  })
  getCurrentUser(@GetUser() user: UserEntity) {
    return user;
  }

  @Query(() => CartEntity, {
    name: 'myCart',
    nullable: true,
    description: 'Get current user last cart',
  })
  getUserLastCart(@GetUser() user: UserEntity): Promise<CartDto | null> {
    return this.cartsService.getUserLastCart(user.id);
  }

  @Query(() => [ProductEntity], {
    name: 'myLikes',
    description: 'Get current user likes',
    nullable: true,
  })
  getUserLikes(@GetUser() user: UserEntity): Promise<ProductDto[] | null> {
    return this.likesService.getUserLikes(user.id);
  }

  @Query(() => [OrderEntity], {
    name: 'myOrders',
    description: 'Retrieve current user orders',
  })
  getUserOrders(@GetUser() user: UserEntity): Promise<OrderDto[] | null> {
    return this.ordersService.getUserOrders(user.id);
  }

  @Mutation(() => UserEntity, {
    name: 'updateUser',
    description: 'Update current user information',
  })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetUser() user: UserEntity,
  ): Promise<UserDto> {
    return this.usersService.update(user.id, updateUserInput);
  }
}
