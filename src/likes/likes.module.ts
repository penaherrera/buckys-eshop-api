import { Module } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { LikesResolver } from './likes.resolver';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [LikesService, LikesResolver, PrismaService],
  exports: [LikesService],
})
export class LikesModule {}
