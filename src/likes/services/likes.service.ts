import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LikeEntity } from '../entities/like.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { GenderEnum } from '../../products/enums/gender.enum';
import { ClothingTypeEnum } from '../../products/enums/clothing-type.enum';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserLikes(userId: number): Promise<ProductEntity[] | null> {
    const likes = await this.prismaService.like.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });

    return likes.map((like) => ({
      ...like.product,
      gender: like.product.gender as GenderEnum,
      clothingType: like.product.clothingType as ClothingTypeEnum,
    }));
  }

  async toggleLike(
    userId: number,
    productId: number,
  ): Promise<LikeEntity | null> {
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

      return newLike;
    }
  }
}
