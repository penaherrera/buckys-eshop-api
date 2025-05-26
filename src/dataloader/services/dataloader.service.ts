import { Injectable } from '@nestjs/common';
import { CategoriesService } from 'src/categories/services/categories.service';
import { IDataloaders } from '../interfaces/dataloader.interface';
import { CategoryEntity } from 'src/categories/entitites/category.entity';
import DataLoader from 'dataloader';

@Injectable()
export class DataloaderService {
  constructor(private readonly categoriesService: CategoriesService) {}

  getLoaders(): IDataloaders {
    const categoriesLoader = this._createCategoriesLoader();
    return {
      categoriesLoader,
    };
  }

  private _createCategoriesLoader() {
    return new DataLoader<number, CategoryEntity>(
      async (productIds: number[]) => {
        return this.categoriesService.getAllCategoriesByProductIds(productIds);
      },
    );
  }
}
