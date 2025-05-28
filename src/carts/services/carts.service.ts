import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CartEntity } from '../entities/cart.entity';
import { SizeEnum } from 'src/variants/enums/size.enum';
import { GenderEnum } from 'src/products/enums/gender.enum';
import { ClothingTypeEnum } from 'src/products/enums/clothing-type.enum';

@Injectable()
export class CartsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserCart(userId: number): Promise<CartEntity | null> {
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
        updatedAt: 'desc',
      },
    });

    if (!cart) {
      return null;
    }

    return {
      ...cart,
      cartProducts: cart.cartProducts.map((cartProduct) => ({
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
      })),
    };
  }
}
