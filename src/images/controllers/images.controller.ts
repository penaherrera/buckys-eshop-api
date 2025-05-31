import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../services/images.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageToCloudinary(
    @UploadedFile() file,
    @Query('productId') productId: string,
  ) {
    console.log(productId);
    return await this.imagesService
      .uploadImageToCloudinary(file, Number(productId))
      .catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
  }
}
