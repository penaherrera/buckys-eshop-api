import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersResolver } from './users/resolvers/users.resolver';
import { ProductsModule } from './products/products.module';
import { DetailsModule } from './details/details.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductTypesModule } from './product-types/product-types.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: 'src/schema.gql',
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          details: error.extensions,
        };
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    DetailsModule,
    CategoriesModule,
    BrandsModule,
    ProductTypesModule,
  ],
  controllers: [AuthController],
  providers: [UsersResolver],
})
export class AppModule {}
