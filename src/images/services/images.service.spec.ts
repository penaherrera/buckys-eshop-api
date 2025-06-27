import {
  createCloudinaryMockService,
  createPrismaMockService,
} from '../../common/mocks';
import { ImagesService } from './images.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  loggerMock,
  productMock,
  uploadedImageMock,
} from '../../common/mocks/mock';
import {
  ConsoleLogger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';

describe('ImagesService', () => {
  let service: ImagesService;
  let prismaMockService;
  let cloudinaryMockService;

  beforeEach(async () => {
    prismaMockService = createPrismaMockService();
    cloudinaryMockService = createCloudinaryMockService();

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryMockService,
        },
      ],
    })
      .setLogger(loggerMock as unknown as ConsoleLogger)
      .compile();

    service = module.get<ImagesService>(ImagesService);
  });

  describe('uploadImageToCloudinary', () => {
    const mockFile = {
      buffer: Buffer.from('test image'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      fieldname: 'image',
      encoding: '7bit',
      size: 1024,
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };
    const productId = 1;

    it('should upload image to cloudinary and update product successfully', async () => {
      prismaMockService.product.findUnique.mockResolvedValue(productMock);
      cloudinaryMockService.uploadImage.mockResolvedValue(uploadedImageMock);
      prismaMockService.product.update.mockResolvedValue({
        ...productMock,
        imageSecureUrl: uploadedImageMock.secure_url,
      });

      await service.uploadImageToCloudinary(mockFile, productId);

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(cloudinaryMockService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(prismaMockService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          imageSecureUrl: uploadedImageMock.secure_url,
        },
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      prismaMockService.product.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadImageToCloudinary(mockFile, productId),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(cloudinaryMockService.uploadImage).not.toHaveBeenCalled();
      expect(prismaMockService.product.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when cloudinary upload fails', async () => {
      prismaMockService.product.findUnique.mockResolvedValue(productMock);
      cloudinaryMockService.uploadImage.mockRejectedValue(
        new Error('Cloudinary upload failed'),
      );

      await expect(
        service.uploadImageToCloudinary(mockFile, productId),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(cloudinaryMockService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(prismaMockService.product.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when product update fails', async () => {
      prismaMockService.product.findUnique.mockResolvedValue(productMock);
      cloudinaryMockService.uploadImage.mockResolvedValue(uploadedImageMock);
      prismaMockService.product.update.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.uploadImageToCloudinary(mockFile, productId),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(cloudinaryMockService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(prismaMockService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          imageSecureUrl: uploadedImageMock.secure_url,
        },
      });
    });

    it('should throw InternalServerErrorException when finding product fails', async () => {
      prismaMockService.product.findUnique.mockRejectedValue(
        new Error('Database connection error'),
      );

      await expect(
        service.uploadImageToCloudinary(mockFile, productId),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaMockService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(cloudinaryMockService.uploadImage).not.toHaveBeenCalled();
      expect(prismaMockService.product.update).not.toHaveBeenCalled();
    });
  });
});
