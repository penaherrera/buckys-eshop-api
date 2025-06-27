import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { DataloaderModule } from './dataloader/dataloader.module';
import { DataloaderService } from './dataloader/services/dataloader.service';
import { EmailModule } from './email/email.module';
import { LikesModule } from './likes/likes.module';
import { CartsModule } from './carts/carts.module';
import { CartProductsModule } from './cart-products/cart-products.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImagesModule } from './images/images.module';
import { StripeModule } from './stripe/stripe.module';
import appConfig from './app/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      load: [appConfig],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [DataloaderService],
      useFactory: (dataloaderService: DataloaderService) => ({
        playground: false,
        autoSchemaFile: 'src/schema.gql',
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: () => ({
          loaders: dataloaderService.getLoaders(),
        }),
        formatError: (error) => {
          return {
            message: error.message,
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            details: error.extensions,
          };
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    VariantsModule,
    CategoriesModule,
    BrandsModule,
    EmailModule,
    LikesModule,
    CartsModule,
    CartProductsModule,
    PaymentsModule,
    OrdersModule,
    TransactionsModule,
    CloudinaryModule,
    ImagesModule,
    StripeModule,
  ],
  controllers: [AuthController],
})
export class AppModule {}
