import { Injectable } from '@nestjs/common';
import { CategoriesService } from '../../categories/services/categories.service';
import { IDataloaders } from '../interfaces/dataloader.interface';
import { CategoryEntity } from '../../categories/entitites/category.entity';
import DataLoader from 'dataloader';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { BrandsService } from '../../brands/services/brands.service';
import { VariantEntity } from '../../variants/entities/variant.entity';
import { VariantsService } from '../../variants/services/variants.service';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly brandsService: BrandsService,
    private readonly variantsService: VariantsService,
  ) {}

  getLoaders(): IDataloaders {
    const loaders: IDataloaders = {
      categoriesLoader: this._createCategoriesLoader(),
      brandsLoader: this._createBrandsLoader(),
      variantsLoader: this._createVariantsLoader(),
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
}
