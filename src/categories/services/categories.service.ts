import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryEntity } from '../entitites/category.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategoriesByProductIds(
    productIds: number[],
  ): Promise<CategoryEntity[]> {
    const productsWithCategories = await this.prismaService.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });

    const categoryByProductId = new Map<number, CategoryEntity>();

    for (const product of productsWithCategories) {
      if (!product.category) {
        throw new NotFoundException(
          `Product with ID ${product.id} has no category`,
        );
      }
      categoryByProductId.set(product.id, product.category);
    }

    return productIds.map((id) => categoryByProductId.get(id)!);
  }
}
