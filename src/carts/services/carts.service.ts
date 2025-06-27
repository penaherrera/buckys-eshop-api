import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CartEntity } from '../entities/cart.entity';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getUserLastCart(userId: number): Promise<CartEntity | null> {
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: {
        cartProducts: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });

    if (!cart) {
      this.logger.error(`User has no carts`);
      throw new NotFoundException('User has no carts');
    }

    return plainToInstance(CartEntity, cart);
  }
}
