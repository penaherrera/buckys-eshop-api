import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { LikeEntity } from './entities/like.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from './services/likes.service';
import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@UseGuards(JwtAuthGuard)
@Resolver(() => LikeEntity)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Query(() => [ProductEntity], { name: 'userLikes' })
  getUserLikes(@GetUser() user: UserEntity): Promise<ProductEntity[] | null> {
    return this.likesService.getUserLikes(user.id);
  }

  @Mutation(() => LikeEntity, { nullable: true, name: 'toggleLike' })
  @UseGuards(JwtAuthGuard)
  toggleLike(
    @GetUser() user: UserEntity,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.likesService.toggleLike(user.id, productId);
  }
}
