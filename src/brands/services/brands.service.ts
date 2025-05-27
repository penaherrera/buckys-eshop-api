import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BrandEntity } from '../entities/brand.entity';

@Injectable()
export class BrandsService {
  private readonly logger = new Logger(BrandsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getAllBrandsByProductIds(productIds: number[]): Promise<BrandEntity[]> {
    const productsWithBrands = await this.prismaService.product.findMany({
      where: { id: { in: productIds } },
      include: { brand: true },
    });

    const brandByProductId = new Map<number, BrandEntity>();

    for (const product of productsWithBrands) {
      if (!product.brand) {
        throw new NotFoundException(
          `Product with ID ${product.id} has no brand`,
        );
      }
      brandByProductId.set(product.id, product.brand);
    }

    return productIds.map((id) => brandByProductId.get(id)!);
  }
}
