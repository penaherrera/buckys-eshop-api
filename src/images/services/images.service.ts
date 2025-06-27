import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ImagesService {
  protected readonly logger = new Logger(ImagesService.name);

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  async uploadImageToCloudinary(file, productId) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        this.logger.error(`Product with ID ${productId} does not exist`);
        throw new NotFoundException(`Product not found`);
      }

      const uploadedImage = await this.cloudinaryService.uploadImage(file);

      await this.prismaService.product.update({
        where: { id: productId },
        data: {
          imageSecureUrl: uploadedImage.secure_url,
        },
      });

      this.logger.log(
        `Image for Product with ID ${productId} uploaded to Cloudinary`,
      );
    } catch (error) {
      this.logger.error(
        `Error uploading image for product ${productId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to upload image');
    }
  }
}
