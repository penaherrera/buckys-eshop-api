import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { VariantEntity } from '../entities/variant.entity';
import { SizeEnum } from '../enums/size.enum';
import { CreateVariantInput } from '../dtos/create-variant.input';

@Injectable()
export class VariantsService {
  private readonly logger = new Logger(VariantsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createMany(createVariants: {
    productId: number;
    variants: CreateVariantInput[];
  }): Promise<void> {
    this.prismaService.$transaction(
      createVariants.variants.map((variant) =>
        this.prismaService.variant.create({
          data: {
            ...variant,
            productId: createVariants.productId,
          },
        }),
      ),
    );
  }

  async getAllVariantsByProductIds(
    productIds: number[],
  ): Promise<VariantEntity[][]> {
    const variants = await this.prismaService.variant.findMany({
      where: { productId: { in: productIds } },
      orderBy: { productId: 'asc' },
    });

    const variantsMap = new Map<number, VariantEntity[]>();
    variants.forEach((variant) => {
      const variantEntity = {
        ...variant,
        size: SizeEnum[variant.size as keyof typeof SizeEnum],
      };
      if (!variantsMap.has(variant.productId)) {
        variantsMap.set(variant.productId, []);
      }
      variantsMap.get(variant.productId)!.push(variantEntity);
    });

    return productIds.map((id) => variantsMap.get(id) || []);
  }

  async removeAllByProductId(productId: number): Promise<void> {
    await this.prismaService.variant.deleteMany({
      where: { productId },
    });
    this.logger.log(`All variants for product ${productId} deleted`);
  }
}
