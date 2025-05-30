import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { UpdateUserInput } from '../dtos/requests/update-user.input';
import { UserDto } from '../dtos/responses/user.dto';
import { CartEntity } from '../../carts/entities/cart.entity';
import { CartDto } from '../../carts/dtos/cart.dto';
import { CartsService } from '../../carts/services/carts.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly cartsService: CartsService,
  ) {}

  @Query(() => UserEntity, { name: 'me' })
  getCurrentUser(@GetUser() user: UserEntity) {
    return user;
  }

  @Query(() => CartEntity, { name: 'userCart', nullable: true })
  getUserLastCart(@GetUser() user: UserEntity): Promise<CartDto | null> {
    return this.cartsService.getUserLastCart(user.id);
  }

  @Mutation(() => UserEntity, { name: 'UpdateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetUser() user: UserEntity,
  ): Promise<UserDto> {
    return this.usersService.update(user.id, updateUserInput);
  }
}
