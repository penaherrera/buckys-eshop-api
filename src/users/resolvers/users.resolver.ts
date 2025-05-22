import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { UpdateUserInput } from '../dtos/requests/update-user.input';

@UseGuards(JwtAuthGuard)
@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserEntity, { name: 'me' })
  getCurrentUser(@GetUser() user: UserEntity) {
    return user;
  }

  @Mutation(() => UserEntity, { name: 'UpdateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetUser() user: UserEntity,
  ): Promise<Omit<UserEntity, 'role'>> {
    return this.usersService.update(user.id, updateUserInput);
  }
}
