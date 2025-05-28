import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CartProductEntity } from '../entities/cart-product.entity';
import { CartEntity } from '../../carts/entities/cart.entity';
import { SizeEnum } from 'src/variants/enums/size.enum';
import { CartsService } from 'src/carts/services/carts.service';
import { ClothingTypeEnum } from 'src/products/enums/clothing-type.enum';
import { GenderEnum } from 'src/products/enums/gender.enum';

@Injectable()
export class CartProductsService {
  private readonly logger = new Logger(CartProductsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartsService: CartsService,
  ) {}

  async addToCart(
    userId: number,
    variantId: number,
  ): Promise<CartProductEntity> {
    const variant = await this.prismaService.variant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    let cart = await this.cartsService.getUserCart(userId);

    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: { userId },
      });
    }

    const cartProduct = await this.prismaService.cartProducts.create({
      data: {
        cartId: cart.id,
        variantId,
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      ...cartProduct,
      variant: {
        ...cartProduct.variant,
        size: cartProduct.variant.size as SizeEnum,
        product: {
          ...cartProduct.variant.product,
          gender: cartProduct.variant.product.gender as GenderEnum,
          clothingType: cartProduct.variant.product
            .clothingType as ClothingTypeEnum,
        },
      },
    };
  }

  async removeFromCart(
    userId: number,
    cartProductId: number,
  ): Promise<boolean> {
    const cart = await this.cartsService.getUserCart(userId);

    if (!cart) {
      this.logger.error(`Cart from user with id ${userId} not found`);
      throw NotFoundException;
    }

    const cartProduct = await this.prismaService.cartProducts.findFirst({
      where: {
        id: cartProductId,
        cartId: cart.id,
      },
    });

    if (!cartProduct) {
      this.logger.error(`Cart product with ID ${cartProductId} not found`);
      throw new NotFoundException(
        `Cart item with ID ${cartProductId} not found in your cart`,
      );
    }

    await this.prismaService.cartProducts.delete({
      where: { id: cartProductId },
    });

    return true;
  }

  async clearCart(userId: number): Promise<boolean> {
    const cart = await this.cartsService.getUserCart(userId);

    if (!cart) {
      this.logger.error(`Cart from user with id ${userId} not found`);
      throw NotFoundException;
    }

    await this.prismaService.cartProducts.deleteMany({
      where: { cartId: cart.id },
    });
    return true;
  }
}
