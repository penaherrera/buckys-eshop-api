import { Module } from '@nestjs/common';
import { ImagesService } from './services/images.service';
import { ImagesController } from './controllers/images.controller';
import { CloudinaryService } from '../cloudinary/services/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  imports: [CloudinaryModule],
  providers: [ImagesService, CloudinaryService, PrismaService],
  controllers: [ImagesController],
})
export class ImagesModule {}
