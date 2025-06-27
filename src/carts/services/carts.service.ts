import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CartDto } from '../dtos/cart.dto';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getUserLastCart(userId: number): Promise<CartDto | null> {
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: {
        cartProducts: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });

    if (!cart) {
      this.logger.error(`User has no carts`);
      throw new NotFoundException('User has no carts');
    }

    return plainToInstance(CartDto, {
      ...cart,
      cartProducts: cart.cartProducts.map((cartProduct) => ({
        ...cartProduct,
        variant: {
          ...cartProduct.variant,
          product: {
            ...cartProduct.variant.product,
            price: cartProduct.variant.product.price.toNumber(),
          },
        },
      })),
    });
  }
}
