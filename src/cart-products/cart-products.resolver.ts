import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartProductsService } from './services/cart-products.service';
import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CartProductEntity } from './entities/cart-product.entity';
import { CartProductDto } from './dtos/cart-product.dto';

@UseGuards(JwtAuthGuard)
@Resolver(() => CartProductEntity)
export class CartProductsResolver {
  constructor(private readonly cartProductsService: CartProductsService) {}

  @Mutation(() => CartProductEntity, { name: 'addToCart' })
  addToCart(
    @GetUser() user: UserEntity,
    @Args('variantId', { type: () => Int }) variantId: number,
    @Args('cartId', { type: () => Int, nullable: true }) cartId: number,
  ): Promise<CartProductDto> {
    return this.cartProductsService.addToCart(user.id, variantId, cartId);
  }

  @Mutation(() => Boolean, { name: 'removeFromCart' })
  removeFromCart(
    @Args('cartProductId', { type: () => Int }) cartProductId: number,
  ) {
    return this.cartProductsService.removeFromCart(cartProductId);
  }

  @Mutation(() => Boolean, { name: 'clearCart' })
  clearCart(@Args('cartId', { type: () => Int }) cartId: number) {
    return this.cartProductsService.clearCart(cartId);
  }
}
