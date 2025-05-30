import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ProductsService } from './services/products.service';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductInput } from './dtos/update-product.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin.guard';
import { CategoryEntity } from '../categories/entitites/category.entity';
import { IDataloaders } from '../dataloader/interfaces/dataloader.interface';
import { BrandEntity } from '../brands/entities/brand.entity';
import { VariantEntity } from '../variants/entities/variant.entity';
import { CreateProductWithVariantsInput } from './dtos/create-product-variants.inputs';
import { ProductDto } from './dtos/responses/product.dto';
import { GraphQlExceptionFilter } from '../common/filters/graphql-exception.filter';

@UseFilters(GraphQlExceptionFilter)
@Resolver(() => ProductEntity)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation(() => ProductEntity, { name: 'createProductWithVariants' })
  createProduct(
    @Args('createProductWithVariantsInput')
    createProductWithVariantsInput: CreateProductWithVariantsInput,
  ): Promise<ProductDto> {
    return this.productsService.createWithVariants(
      createProductWithVariantsInput,
    );
  }

  @Query(() => [ProductEntity], { name: 'products' })
  findAll(): Promise<ProductDto[]> {
    return this.productsService.findAll();
  }

  @ResolveField('category', () => CategoryEntity)
  getCategory(
    @Parent() product: ProductEntity,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    return loaders.categoriesLoader.load(product.id);
  }

  @ResolveField('brand', () => BrandEntity)
  getBrand(
    @Parent() product: ProductEntity,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    return loaders.brandsLoader.load(product.id);
  }

  @ResolveField('variants', () => [VariantEntity])
  getVariants(
    @Parent() product: ProductEntity,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    return loaders.variantsLoader.load(product.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation(() => ProductEntity, { name: 'updateProduct' })
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation(() => ProductEntity, { name: 'toggleProductActive' })
  toggleProductActive(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ProductDto> {
    return this.productsService.toggleActive(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation(() => ProductEntity, { name: 'removeProduct' })
  removeProduct(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ProductDto> {
    return this.productsService.remove(id);
  }
}
