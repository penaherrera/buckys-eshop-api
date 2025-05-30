import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderEntity } from '../entities/order.entity';
import { SizeEnum } from 'src/variants/enums/size.enum';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async create(cartId: number, paymentIntentId: string): Promise<OrderEntity> {
    const cart = await this.prismaService.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      this.logger.error(`Cart with ID ${cartId} not found`);
      throw new NotFoundException('Cart  not found');
    }

    const order = await this.prismaService.order.create({
      data: { cartId, stripePaymentIntendId: paymentIntentId },
    });

    return order;
  }

  async findByPaymentIntent(paymentIntent: string): Promise<OrderEntity> {
    const order = await this.prismaService.order.findFirst({
      where: { stripePaymentIntendId: paymentIntent },
    });

    if (!order) {
      this.logger.error(`Order with payment intent ${paymentIntent} not found`);
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getUserOrders(userId: number): Promise<OrderEntity[]> {
    const orders = await this.prismaService.order.findMany({
      where: {
        cart: {
          userId: userId,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        transactions: true,
        cart: {
          include: {
            cartProducts: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return orders.map((order) => {
      const mappedCartProducts = order.cart.cartProducts.map((cartProduct) => ({
        ...cartProduct,
        variant: {
          ...cartProduct.variant,
          size: cartProduct.variant.size as SizeEnum,
        },
      }));

      return {
        ...order,
        cart: {
          ...order.cart,
          cartProducts: mappedCartProducts,
        },
        transactions: order.transactions,
      } as OrderEntity;
    });
  }
}
