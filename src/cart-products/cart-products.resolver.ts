import {
  Args,
  Int,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartProductsService } from './services/cart-products.service';
import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CartProductEntity } from './entities/cart-product.entity';
import { GraphQlExceptionFilter } from '../common/filters/graphql-exception.filter';
import { VariantEntity } from '../variants/entities/variant.entity';
import { IDataloaders } from '../dataloader/interfaces/dataloader.interface';

@UseFilters(GraphQlExceptionFilter)
@UseGuards(JwtAuthGuard)
@Resolver(() => CartProductEntity)
export class CartProductsResolver {
  constructor(private readonly cartProductsService: CartProductsService) {}

  @ResolveField('variant', () => VariantEntity)
  getVariants(
    @Parent() cartProduct: CartProductEntity,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    return loaders.cartProductsLoader.load(cartProduct.id);
  }

  @Mutation(() => CartProductEntity, {
    name: 'addToCart',
    description:
      'Adds product to shopping cart (creates new cart if none exists). Accepts optional cartId for specific cart selection.',
  })
  addToCart(
    @GetUser() user: UserEntity,
    @Args('variantId', { type: () => Int }) variantId: number,
    @Args('cartId', { type: () => Int, nullable: true }) cartId: number,
  ): Promise<CartProductEntity> {
    return this.cartProductsService.addToCart(user.id, variantId, cartId);
  }

  @Mutation(() => Boolean, {
    name: 'removeFromCart',
    description: 'Remove a product from a cart',
  })
  removeFromCart(
    @Args('cartProductId', { type: () => Int }) cartProductId: number,
  ) {
    return this.cartProductsService.removeFromCart(cartProductId);
  }

  @Mutation(() => Boolean, {
    name: 'clearCart',
    description: 'Remove all items from a cart',
  })
  clearCart(@Args('cartId', { type: () => Int }) cartId: number) {
    return this.cartProductsService.clearCart(cartId);
  }
}
