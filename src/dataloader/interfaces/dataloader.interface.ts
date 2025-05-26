import DataLoader from 'dataloader';
import { CategoryEntity } from '../../categories/entitites/category.entity';

export interface IDataloaders {
  categoriesLoader: DataLoader<number, CategoryEntity>;
}
