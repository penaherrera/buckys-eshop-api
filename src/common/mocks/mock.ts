import { UserEntity } from '../../users/entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { GenderEnum } from '../../products/enums/gender.enum';
import { ClothingTypeEnum } from '../../products/enums/clothing-type.enum';
import { Decimal } from '@prisma/client/runtime/library';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { CategoryEntity } from '../../categories/entitites/category.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { AuthEntity } from '../../auth/entities/auth.entity';
import { CartEntity } from '../../carts/entities/cart.entity';
import { SizeEnum } from '../../variants/enums/size.enum';
import { VariantEntity } from '../../variants/entities/variant.entity';
import { OrderEntity } from '../../orders/entities/order.entity';
import { StatusEnum } from '../../orders/enums/status.enum';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';
import { LikeEntity } from '../../likes/entities/like.entity';
import { CartDto } from '../../carts/dtos/cart.dto';

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

export const productMock: ProductEntity = {
  id: 1,
  categoryId: 1,
  brandId: 1,
  isActive: true,
  inStock: true,
  name: 'Sample',
  description: 'Sample product description',
  price: new Decimal(100),
  gender: GenderEnum.UNISEX,
  clothingType: ClothingTypeEnum.CLOTHING,
  createdAt: now,
  updatedAt: now,
  deletedAt: null,
  imageSecureUrl: null,
};

export const variantMock: VariantEntity = {
  id: 1,
  productId: 1,
  stock: 100,
  color: 'black',
  size: SizeEnum.EXTRA_SMALL,
  createdAt: now,
  updatedAt: now,
  product: productMock,
};

export const cartDtoMock: CartDto = {
  id: 1,
  userId: 1,
  cartProducts: [
    {
      id: 1,
      variantId: 1,
      cartId: 1,
      createdAt: now,
    },
  ],
  createdAt: now,
  updatedAt: now,
};

export const cartMock: CartEntity = {
  id: 1,
  userId: 1,
  cartProducts: [
    {
      id: 1,
      variant: {
        id: 1,
        color: 'black',
        product: {
          id: 1,
          name: 'Product 1',
          price: new Decimal(100),
          categoryId: 1,
          brandId: 1,
          isActive: false,
          inStock: false,
          description: '',
          gender: GenderEnum.UNISEX,
          clothingType: ClothingTypeEnum.CLOTHING,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          imageSecureUrl: null,
        },
        productId: 1,
        stock: 1,
        size: SizeEnum.EXTRA_SMALL,
        createdAt: now,
        updatedAt: now,
      },
      variantId: 1,
      cartId: 1,
      createdAt: now,
    },
  ],
  createdAt: now,
  updatedAt: now,
};

export const orderMock: OrderEntity = {
  id: 1,
  cartId: 1,
  status: StatusEnum.PENDING,
  stripePaymentIntendId: 'pi_test_123',
  createdAt: now,
};

export const transactionMock: TransactionEntity = {
  id: 1,
  orderId: 1,
  amount: 1,
  stripeChargeId: 'ch_test_123',
  receiptUrl: '',
  currency: 'usd',
  stripeStatus: 'SUCCEEDED',
  createdAt: now,
  order: orderMock,
};

export const ordersMock: OrderEntity[] = [
  {
    ...orderMock,
    cart: {
      ...cartMock,
      userId: cartMock.userId,
      cartProducts: [
        {
          variant: {
            product: {
              price: new Decimal(100),
              id: 1,
              categoryId: 1,
              brandId: 1,
              isActive: false,
              inStock: false,
              name: 'test',
              description: 'test description',
              gender: GenderEnum.UNISEX,
              clothingType: ClothingTypeEnum.CLOTHING,
              createdAt: now,
              updatedAt: now,
              deletedAt: null,
              imageSecureUrl: null,
            },
            id: 1,
            productId: 1,
            stock: 1,
            color: '',
            size: SizeEnum.EXTRA_SMALL,
            createdAt: now,
            updatedAt: now,
          },
          id: 1,
          variantId: 1,
          cartId: 1,
          createdAt: now,
        },
      ],
    },
    transactions: [transactionMock],
  },
];

export const likesMock: LikeEntity[] = [
  { id: 1, userId: 1, productId: 1, createdAt: now, products: [productMock] },
];

export const likeMock: LikeEntity = {
  id: 1,
  productId: 1,
  userId: 1,
  createdAt: now,
};

export const cartProductMock = {
  id: 1,
  cartId: cartMock.id,
  variantId: variantMock.id,
  variant: variantMock,
};

export const adminRoleMock: RoleEntity = {
  id: 1,
  name: 'Administrator',
  slug: 'admin',
  createdAt: now,
  updatedAt: now,
};

export const clientRoleMock: RoleEntity = {
  id: 2,
  name: 'Client',
  slug: 'client',
  createdAt: now,
  updatedAt: now,
};

export const variantsMock: VariantEntity[] = [
  {
    id: 1,
    productId: 1,
    color: 'red',
    size: SizeEnum.SMALL,
    stock: 100,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    productId: 1,
    color: 'blue',
    size: SizeEnum.MEDIUM,
    stock: 50,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    productId: 2,
    color: 'green',
    size: SizeEnum.LARGE,
    stock: 75,
    createdAt: now,
    updatedAt: now,
  },
];

export const paymentIntentMock = {
  id: 'pi_test_123',
  amount: 5000,
  currency: 'usd',
  status: 'requires_payment_method',
};

export const chargeMock = {
  id: 'ch_test123',
  amount: 2000,
  currency: 'usd',
  payment_intent: 'pi_test123',
  receipt_url: 'https://pay.stripe.com/receipts/test',
};

export const loggerMock = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};
