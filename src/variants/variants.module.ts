import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { VariantsService } from './services/variants.service';

@Module({
  providers: [VariantsService, PrismaService],
  exports: [VariantsService],
})
export class VariantsModule {}
