import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [PrismaService],
})
export class TransactionsModule {}
