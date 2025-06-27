import DataLoader from 'dataloader';
import { CategoryEntity } from '../../categories/entitites/category.entity';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { VariantEntity } from '../../variants/entities/variant.entity';
import { ProductEntity } from '../../products/entities/product.entity';

export interface IDataloaders {
  categoriesLoader: DataLoader<number, CategoryEntity>;
  brandsLoader: DataLoader<number, BrandEntity>;
  variantsLoader: DataLoader<number, VariantEntity[]>;
  cartProductsLoader: DataLoader<number, VariantEntity | null>;
  productsLoader: DataLoader<number, ProductEntity | null>;
}
