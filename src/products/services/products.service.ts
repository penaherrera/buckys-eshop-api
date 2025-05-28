import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from '../dtos/create-product.input';
import { UpdateProductInput } from '../dtos/update-product.input';
import { PrismaService } from '../../common/prisma/prisma.service';
import { GenderEnum } from '../enums/gender.enum';
import { ProductEntity } from '../entities/product.entity';
import { ClothingTypeEnum } from '../enums/clothing-type.enum';
import { CreateProductWithVariantsInput } from '../dtos/create-product-variants.inputs';
import { VariantsService } from 'src/variants/services/variants.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly variantsService: VariantsService,
  ) {}

  async createWithVariants(
    createProductWithVariantsInput: CreateProductWithVariantsInput,
  ): Promise<ProductEntity> {
    const product = await this.create(createProductWithVariantsInput.product);

    await this.variantsService.createMany({
      productId: product.id,
      variants: createProductWithVariantsInput.variants,
    });

    return product;
  }

  async create(createProductInput: CreateProductInput): Promise<ProductEntity> {
    await this.verifyIdsExist(createProductInput);

    const product = await this.prismaService.product.create({
      data: {
        ...createProductInput,
      },
    });

    this.logger.log('Product created successfully');

    return {
      ...product,
      gender: product.gender as GenderEnum,
      clothingType: product.clothingType as ClothingTypeEnum,
    };
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prismaService.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => ({
      ...product,
      gender: product.gender as GenderEnum,
      clothingType: product.clothingType as ClothingTypeEnum,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<ProductEntity> {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      this.logger.error(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product not found`);
    }

    await this.verifyIdsExist(updateProductInput);

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: {
        ...updateProductInput,
      },
    });

    this.logger.log(`Product with ID ${id} updated successfully`);

    return {
      ...updatedProduct,
      gender: updatedProduct.gender as GenderEnum,
      clothingType: updatedProduct.clothingType as ClothingTypeEnum,
    };
  }

  async remove(id: number): Promise<ProductEntity> {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      this.logger.error(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product not found`);
    }

    await this.variantsService.removeAllByProductId(id);

    const deletedProduct = await this.prismaService.product.delete({
      where: { id },
    });

    this.logger.log(`Product with ID ${id} permanently deleted`);

    return {
      ...deletedProduct,
      gender: deletedProduct.gender as GenderEnum,
      clothingType: deletedProduct.clothingType as ClothingTypeEnum,
    };
  }

  async toggleActive(id: number): Promise<ProductEntity> {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      this.logger.error(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product not found`);
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: {
        isActive: !existingProduct.isActive,
        ...(existingProduct.isActive && { deletedAt: new Date() }),
        ...(!existingProduct.isActive && { deletedAt: null }),
      },
    });

    this.logger.log(
      `Product with ID ${id} toggled active status to ${updatedProduct.isActive}`,
    );

    return {
      ...updatedProduct,
      gender: updatedProduct.gender as GenderEnum,
      clothingType: updatedProduct.clothingType as ClothingTypeEnum,
    };
  }

  private async verifyIdsExist(
    input: Partial<Pick<CreateProductInput, 'categoryId' | 'brandId'>>,
  ): Promise<void> {
    const { categoryId, brandId } = input;

    if (categoryId !== undefined) {
      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        this.logger.error(`Category with ID ${categoryId} not found`);
        throw new NotFoundException('Category not found');
      }
    }

    if (brandId !== undefined) {
      const brand = await this.prismaService.brand.findUnique({
        where: { id: brandId },
      });
      if (!brand) {
        this.logger.error(`Brand with ID ${brandId} not found`);
        throw new NotFoundException('Brand not found');
      }
    }
  }
}
