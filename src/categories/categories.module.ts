import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [CategoriesService, PrismaService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
