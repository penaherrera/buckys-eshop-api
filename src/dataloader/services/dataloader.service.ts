import { Injectable } from '@nestjs/common';
import { CategoriesService } from '../../categories/services/categories.service';
import { IDataloaders } from '../interfaces/dataloader.interface';
import { CategoryEntity } from '../../categories/entitites/category.entity';
import DataLoader from 'dataloader';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { BrandsService } from '../../brands/services/brands.service';
import { VariantEntity } from '../../variants/entities/variant.entity';
import { VariantsService } from '../../variants/services/variants.service';
import { VariantDto } from '../../variants/dtos/responses/variant.dto';
import { ProductsService } from '../../products/services/products.service';
import { ProductDto } from '../../products/dtos/responses/product.dto';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly brandsService: BrandsService,
    private readonly variantsService: VariantsService,
    private readonly productsService: ProductsService,
  ) {}

  getLoaders(): IDataloaders {
    const loaders: IDataloaders = {
      categoriesLoader: this._createCategoriesLoader(),
      brandsLoader: this._createBrandsLoader(),
      variantsLoader: this._createVariantsLoader(),
      cartProductsLoader: this._createCartProductsLoader(),
      productsLoader: this._createProductsLoader(),
    };

    return loaders;
  }

  private _createCategoriesLoader() {
    return new DataLoader<number, CategoryEntity>(
      async (productIds: number[]) => {
        return this.categoriesService.getAllCategoriesByProductIds(productIds);
      },
    );
  }

  private _createBrandsLoader() {
    return new DataLoader<number, BrandEntity>(async (productIds: number[]) => {
      return this.brandsService.getAllBrandsByProductIds(productIds);
    });
  }

  private _createVariantsLoader() {
    return new DataLoader<number, VariantEntity[]>(
      async (productIds: number[]) => {
        return await this.variantsService.getAllVariantsByProductIds(
          productIds,
        );
      },
    );
  }

  private _createCartProductsLoader() {
    return new DataLoader<number, VariantDto | null>(
      async (cartProductIds: readonly number[]) => {
        return await this.variantsService.getAllVariantsByCartProductIds([
          ...cartProductIds,
        ]);
      },
    );
  }

  private _createProductsLoader() {
    return new DataLoader<number, ProductDto | null>(
      async (variantIds: readonly number[]) => {
        return this.productsService.getAllProductsByVariantIds([...variantIds]);
      },
    );
  }
}
