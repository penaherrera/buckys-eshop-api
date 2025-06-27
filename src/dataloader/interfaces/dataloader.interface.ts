import DataLoader from 'dataloader';
import { CategoryEntity } from '../../categories/entitites/category.entity';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { VariantEntity } from '../../variants/entities/variant.entity';

export interface IDataloaders {
  categoriesLoader: DataLoader<number, CategoryEntity>;
  brandsLoader: DataLoader<number, BrandEntity>;
  variantsLoader: DataLoader<number, VariantEntity[]>;
}
