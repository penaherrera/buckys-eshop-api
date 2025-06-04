import { UserEntity } from '../../users/entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { ProductDto } from '../../products/dtos/responses/product.dto';
import { GenderEnum } from '../../products/enums/gender.enum';
import { ClothingTypeEnum } from '../../products/enums/clothing-type.enum';
import { BrandDto } from '../../brands/dtos/brand.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { BrandEntity } from 'src/brands/entities/brand.entity';
import { CategoryEntity } from 'src/categories/entitites/category.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';

const now = new Date();

export const roleMock: RoleEntity = {
  name: 'Client',
  id: 2,
  slug: 'client',
  createdAt: now,
  updatedAt: now,
};

export const userMock: UserEntity = {
  id: 1,
  roleId: 2,
  firstName: 'Carlos',
  lastName: 'Pena',
  address: 'Fake address at 123 main st',
  phoneNumber: '+51987654321',
  email: 'carlospena@yopmail.com',
  password: 'Nestjs1*',
  resetPasswordToken: null,
  createdAt: now,
  updatedAt: now,
  deletedAt: null,
  role: roleMock,
};

export const brandMock1: BrandEntity = {
  id: 1,
  name: 'Brand 1',
  createdAt: now,
  updatedAt: now,
  description: 'Fake brand',
  isActive: true,
};

export const brandMock2: BrandEntity = {
  id: 2,
  name: 'Brand 2',
  createdAt: now,
  updatedAt: now,
  description: 'Fake brand',
  isActive: false,
};

export const categoryMock: CategoryEntity = {
  id: 1,
  name: 'Anime',
  createdAt: now,
  updatedAt: now,
};

export const brandProductsMock: ProductEntity[] = [
  {
    id: 1,
    name: 'Product 1',
    categoryId: 1,
    brandId: brandMock1.id,
    isActive: true,
    inStock: true,
    description: 'Description 1',
    price: new Decimal(100),
    gender: GenderEnum.UNISEX,
    clothingType: ClothingTypeEnum.TSHIRT,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    imageSecureUrl: null,
    brand: brandMock1,
    category: categoryMock,
  },
  {
    id: 2,
    name: 'Product 2',
    categoryId: 2,
    brandId: brandMock2.id,
    isActive: true,
    inStock: true,
    description: 'Description 2',
    price: new Decimal(200),
    gender: GenderEnum.UNISEX,
    clothingType: ClothingTypeEnum.PANTS,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    imageSecureUrl: null,
    brand: brandMock2,
    category: categoryMock,
  },
];

export const categoryMock1: CategoryEntity = {
  id: 1,
  name: 'Category 1',
  createdAt: now,
  updatedAt: now,
  products: [],
};

export const categoryMock2: CategoryEntity = {
  id: 2,
  name: 'Category 2',
  createdAt: now,
  updatedAt: now,
  products: [],
};

export const categoryProductsMock = [
  {
    id: 1,
    name: 'Product 1',
    categoryId: 1,
    brandId: 1,
    isActive: true,
    inStock: true,
    description: 'Description 1',
    price: new Decimal(100),
    gender: GenderEnum.UNISEX,
    clothingType: ClothingTypeEnum.TSHIRT,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    imageSecureUrl: null,
    category: categoryMock1,
  },
  {
    id: 2,
    name: 'Product 2',
    categoryId: 2,
    brandId: 2,
    isActive: true,
    inStock: true,
    description: 'Description 2',
    price: new Decimal(200),
    gender: GenderEnum.UNISEX,
    clothingType: ClothingTypeEnum.PANTS,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    imageSecureUrl: null,
    category: categoryMock2,
  },
];

export const authMock: AuthEntity = {
  id: 1,
  jti: '123',
  userId: 1,
  refreshToken: '',
  refreshExpiresAt: now,
  createdAt: now,
  user: userMock,
};
