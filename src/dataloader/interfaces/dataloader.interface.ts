import DataLoader from 'dataloader';
import { CategoryEntity } from '../../categories/entitites/category.entity';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { VariantEntity } from '../../variants/entities/variant.entity';
import { VariantDto } from '../../variants/dtos/responses/variant.dto';
import { ProductDto } from '../../products/dtos/responses/product.dto';

export interface IDataloaders {
  categoriesLoader: DataLoader<number, CategoryEntity>;
  brandsLoader: DataLoader<number, BrandEntity>;
  variantsLoader: DataLoader<number, VariantEntity[]>;
  cartProductsLoader: DataLoader<number, VariantDto | null>;
  productsLoader: DataLoader<number, ProductDto | null>;
}
