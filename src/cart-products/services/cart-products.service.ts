import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CartProductDto } from '../dtos/cart-product.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartProductsService {
  private readonly logger = new Logger(CartProductsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async addToCart(
    userId: number,
    variantId: number,
    cartId?: number | null,
  ): Promise<CartProductDto> {
    const variant = await this.prismaService.variant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    let cart;

    if (cartId) {
      cart = await this.prismaService.cart.findUnique({
        where: { id: cartId },
      });

      if (cart && cart.userId !== userId) {
        throw new ForbiddenException(
          'This cart does not belong to the current user',
        );
      }
    }

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

    return plainToInstance(CartProductDto, {
      ...cartProduct,
      variant: {
        ...cartProduct.variant,
        product: {
          ...cartProduct.variant.product,
          price: cartProduct.variant.product.price.toNumber(),
        },
      },
    });
  }

  async removeFromCart(cartProductId: number): Promise<boolean> {
    const cartProduct = await this.prismaService.cartProducts.findUnique({
      where: { id: cartProductId },
    });

    if (!cartProduct) {
      this.logger.error(`Cart product with ID ${cartProductId} not found`);
      throw new NotFoundException(
        `Cart item with ID ${cartProductId} not found`,
      );
    }

    await this.prismaService.cartProducts.delete({
      where: { id: cartProductId },
    });

    return true;
  }

  async clearCart(cartId: number): Promise<boolean> {
    const cart = await this.prismaService.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      this.logger.error(`Cart with id ${cartId} not found`);
      throw new NotFoundException();
    }

    await this.prismaService.cartProducts.deleteMany({
      where: { cartId: cart.id },
    });

    return true;
  }
}
