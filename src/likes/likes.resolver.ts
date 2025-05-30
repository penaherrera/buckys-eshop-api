import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { LikeEntity } from './entities/like.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from './services/likes.service';
import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { LikeDto } from './dtos/like.dto';
import { ProductDto } from 'src/products/dtos/responses/product.dto';

@UseGuards(JwtAuthGuard)
@Resolver(() => LikeEntity)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Query(() => [ProductEntity], { name: 'userLikes' })
  getUserLikes(@GetUser() user: UserEntity): Promise<ProductDto[] | null> {
    return this.likesService.getUserLikes(user.id);
  }

  @Mutation(() => LikeEntity, { nullable: true, name: 'toggleLike' })
  @UseGuards(JwtAuthGuard)
  toggleLike(
    @GetUser() user: UserEntity,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<LikeDto | null> {
    return this.likesService.toggleLike(user.id, productId);
  }
}
