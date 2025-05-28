import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartProductsService } from './services/cart-products.service';
import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CartProductEntity } from './entities/cart-product.entity';
import { CartEntity } from '../carts/entities/cart.entity';
import { CartsService } from '../carts/services/carts.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => CartProductEntity)
export class CartProductsResolver {
  constructor(
    private readonly cartProductsService: CartProductsService,
    private readonly cartsService: CartsService,
  ) {}

  @Query(() => CartEntity, { name: 'userCart', nullable: true })
  getUserCart(@GetUser() user: UserEntity) {
    return this.cartsService.getUserCart(user.id);
  }

  @Mutation(() => CartProductEntity, { name: 'addToCart' })
  addToCart(
    @GetUser() user: UserEntity,
    @Args('variantId', { type: () => Int }) variantId: number,
  ) {
    return this.cartProductsService.addToCart(user.id, variantId);
  }

  @Mutation(() => Boolean, { name: 'removeFromCart' })
  removeFromCart(
    @GetUser() user: UserEntity,
    @Args('cartProductId', { type: () => Int }) cartProductId: number,
  ) {
    return this.cartProductsService.removeFromCart(user.id, cartProductId);
  }

  @Mutation(() => Boolean, { name: 'clearCart' })
  clearCart(@GetUser() user: UserEntity) {
    return this.cartProductsService.clearCart(user.id);
  }
}
