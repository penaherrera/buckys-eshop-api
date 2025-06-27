import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { LikeDto } from '../dtos/like.dto';
import { ProductDto } from '../../products/dtos/responses/product.dto';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserLikes(userId: number): Promise<ProductDto[] | null> {
    const likes = await this.prismaService.like.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { product: true },
    });

    if (!likes || likes.length === 0) {
      return null;
    }

    return likes.map((like) =>
      plainToInstance(ProductDto, {
        ...like.product,
      }),
    );
  }

  async toggleLike(userId: number, productId: number): Promise<LikeDto | null> {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existingLike = await this.prismaService.like.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingLike) {
      await this.prismaService.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return null;
    } else {
      const newLike = await this.prismaService.like.create({
        data: {
          userId,
          productId,
        },
      });

      return plainToInstance(LikeDto, newLike);
    }
  }
}
