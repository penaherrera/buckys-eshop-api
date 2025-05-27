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
import { VariantsModule } from './variants/variants.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { DataloaderModule } from './dataloader/dataloader.module';
import { DataloaderService } from './dataloader/services/dataloader.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
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
  ],
  controllers: [AuthController],
  providers: [UsersResolver],
})
export class AppModule {}
