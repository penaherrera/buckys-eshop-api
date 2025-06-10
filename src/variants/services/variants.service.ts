import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { VariantEntity } from '../entities/variant.entity';
import { SizeEnum } from '../enums/size.enum';
import { CreateVariantInput } from '../dtos/create-variant.input';
import { plainToInstance } from 'class-transformer';
import { VariantDto } from '../dtos/responses/variant.dto';

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

  async getAllVariantsByCartProductIds(
    cartProductIds: number[],
  ): Promise<(VariantDto | null)[]> {
    const cartProducts = await this.prismaService.cartProducts.findMany({
      where: {
        id: { in: cartProductIds },
      },
      include: {
        variant: true,
      },
    });

    const variants = cartProductIds.map((cartProductId) => {
      const cartProduct = cartProducts.find((cp) => cp.id === cartProductId);
      if (!cartProduct || !cartProduct.variant) {
        return null;
      }

      return plainToInstance(VariantDto, cartProduct.variant);
    });

    return variants;
  }

  async removeAllByProductId(productId: number): Promise<void> {
    const existingOrder = await this.prismaService.order.findFirst({
      where: {
        cart: {
          cartProducts: {
            some: {
              variant: {
                productId: productId,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (existingOrder) {
      this.logger.error(
        `Cannot delete product with ID ${productId} because it has variants associated with existing orders`,
      );
      throw new ConflictException(
        `Cannot delete product with ID ${productId} because it has variants associated with existing orders`,
      );
    }

    await this.prismaService.variant.deleteMany({
      where: {
        productId: productId,
      },
    });

    this.logger.log(
      `All variants for product with ID ${productId} deleted successfully`,
    );
  }
}
