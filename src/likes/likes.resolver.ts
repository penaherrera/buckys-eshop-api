import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { LikeEntity } from './entities/like.entity';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from './services/likes.service';
import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { LikeDto } from './dtos/like.dto';
import { GraphQlExceptionFilter } from '../common/filters/graphql-exception.filter';

@UseFilters(GraphQlExceptionFilter)
@UseGuards(JwtAuthGuard)
@Resolver(() => LikeEntity)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LikeEntity, {
    nullable: true,
    name: 'toggleLike',
    description: "Adds or removes a user's like from a product.",
  })
  toggleLike(
    @GetUser() user: UserEntity,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<LikeDto | null> {
    return this.likesService.toggleLike(user.id, productId);
  }
}
