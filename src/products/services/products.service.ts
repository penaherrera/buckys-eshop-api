import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from '../dtos/create-product.input';
import { UpdateProductInput } from '../dtos/update-product.input';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProductWithVariantsInput } from '../dtos/create-product-variants.inputs';
import { VariantsService } from '../../variants/services/variants.service';
import { plainToInstance } from 'class-transformer';
import { ProductDto } from '../dtos/responses/product.dto';
import { PaginationArgs } from '../../common/pagination/dtos/pagination.dto';
import { PaginatedProductsDto } from '../dtos/responses/paginated-product.dto';
import {
  calculatePagination,
  paginationMetadata,
} from '../../common/pagination/pagination';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly variantsService: VariantsService,
  ) {}

  async createWithVariants(
    createProductWithVariantsInput: CreateProductWithVariantsInput,
  ): Promise<ProductDto> {
    const product = await this.create(createProductWithVariantsInput.product);

    await this.variantsService.createMany({
      productId: product.id,
      variants: createProductWithVariantsInput.variants,
    });

    return plainToInstance(ProductDto, product);
  }

  async create(createProductInput: CreateProductInput): Promise<ProductDto> {
    await this.verifyIdsExist(createProductInput);

    const product = await this.prismaService.product.create({
      data: {
        ...createProductInput,
      },
    });

    this.logger.log('Product created successfully');

    return plainToInstance(ProductDto, product);
  }

  async findAll(args: PaginationArgs): Promise<PaginatedProductsDto> {
    const { page = 1, perPage = 10, categoryId } = args;

    const validPage = Math.max(1, page);
    const validPerPage = Math.min(Math.max(1, perPage), 100);

    const { skip, take } = calculatePagination(validPage, validPerPage);

    const whereConditions = {
      isActive: true,
      ...(categoryId && { categoryId }),
    };

    const [products, total] = await Promise.all([
      this.prismaService.product.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          brand: true,
          variants: true,
        },
      }),
      this.prismaService.product.count({
        where: whereConditions,
      }),
    ]);

    const productDtos = plainToInstance(ProductDto, products);

    const meta = paginationMetadata(validPage, validPerPage, total);

    return {
      data: productDtos,
      meta,
    };
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<ProductDto> {
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

    return plainToInstance(ProductDto, updatedProduct);
  }

  async remove(id: number): Promise<boolean> {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      this.logger.error(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product not found`);
    }

    await this.variantsService.removeAllByProductId(id);

    await this.prismaService.product.delete({
      where: { id },
    });

    this.logger.log(`Product with ID ${id} permanently deleted`);
    return true;
  }

  async toggleActive(id: number): Promise<ProductDto> {
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

    return plainToInstance(ProductDto, updatedProduct);
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
