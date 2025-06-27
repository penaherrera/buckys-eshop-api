import { CartProductsService } from './cart-products.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  ConsoleLogger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { createPrismaMockService } from '../../common/mocks';

import {
  cartMock,
  cartProductMock,
  loggerMock,
  userMock,
  variantMock,
} from '../../common/mocks/mock';

describe('CartProductsService', () => {
  let prismaMockService;
  let service: CartProductsService;

  beforeEach(async () => {
    prismaMockService = createPrismaMockService();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductsService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    })
      .setLogger(loggerMock as unknown as ConsoleLogger)
      .compile();

    service = module.get<CartProductsService>(CartProductsService);
  });

  const userId = userMock.id;
  const variantId = variantMock.id;
  const cartId = cartMock.id;

  describe('addToCart', () => {
    it('should create a new cart if no cartId provided', async () => {
      prismaMockService.variant.findUnique.mockResolvedValueOnce(variantMock);
      prismaMockService.cart.create.mockResolvedValueOnce(cartMock);
      prismaMockService.cartProducts.create.mockResolvedValueOnce(
        cartProductMock,
      );

      const result = await service.addToCart(userId, variantId);

      expect(prismaMockService.variant.findUnique).toHaveBeenCalledWith({
        where: { id: variantId },
        include: { product: true },
      });
      expect(prismaMockService.cart.create).toHaveBeenCalledWith({
        data: { userId },
      });
      expect(prismaMockService.cartProducts.create).toHaveBeenCalledWith({
        data: {
          cartId: cartMock.id,
          variantId,
        },
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      });
      expect(result).toBeDefined();
    });

    it('should use existing cart if valid cartId provided', async () => {
      const existingCart = { ...cartMock, userId };

      prismaMockService.variant.findUnique.mockResolvedValueOnce(variantMock);
      prismaMockService.cart.findUnique.mockResolvedValueOnce(existingCart);
      prismaMockService.cartProducts.create.mockResolvedValueOnce(
        cartProductMock,
      );

      await service.addToCart(userId, variantId, cartId);

      expect(prismaMockService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: cartId },
      });
      expect(prismaMockService.cart.create).not.toHaveBeenCalled();
      expect(prismaMockService.cartProducts.create).toHaveBeenCalledWith({
        data: {
          cartId: existingCart.id,
          variantId,
        },
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if variant not found', async () => {
      prismaMockService.variant.findUnique.mockResolvedValueOnce(null);

      await expect(service.addToCart(userId, variantId)).rejects.toThrow(
        new NotFoundException(`Variant with ID ${variantId} not found`),
      );

      expect(prismaMockService.cart.create).not.toHaveBeenCalled();
      expect(prismaMockService.cartProducts.create).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if cart belongs to different user', async () => {
      const differentUserCart = { ...cartMock, userId: userId + 1 };

      prismaMockService.variant.findUnique.mockResolvedValueOnce(variantMock);
      prismaMockService.cart.findUnique.mockResolvedValueOnce(
        differentUserCart,
      );

      await expect(
        service.addToCart(userId, variantId, cartId),
      ).rejects.toThrow(
        new ForbiddenException('This cart does not belong to the current user'),
      );

      expect(prismaMockService.cartProducts.create).not.toHaveBeenCalled();
    });

    it('should create new cart if provided cartId does not exist', async () => {
      prismaMockService.variant.findUnique.mockResolvedValueOnce(variantMock);
      prismaMockService.cart.findUnique.mockResolvedValueOnce(null);
      prismaMockService.cart.create.mockResolvedValueOnce(cartMock);
      prismaMockService.cartProducts.create.mockResolvedValueOnce(
        cartProductMock,
      );

      await service.addToCart(userId, variantId, cartId);

      expect(prismaMockService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: cartId },
      });
      expect(prismaMockService.cart.create).toHaveBeenCalledWith({
        data: { userId },
      });
    });
  });

  describe('removeFromCart', () => {
    const cartProductId = 1;
    const cartProductMock = {
      id: cartProductId,
      cartId: cartMock.id,
      variantId: variantMock.id,
    };

    it('should remove cart product successfully', async () => {
      prismaMockService.cartProducts.findUnique.mockResolvedValueOnce(
        cartProductMock,
      );
      prismaMockService.cartProducts.delete.mockResolvedValueOnce(
        cartProductMock,
      );

      const result = await service.removeFromCart(cartProductId);

      expect(prismaMockService.cartProducts.findUnique).toHaveBeenCalledWith({
        where: { id: cartProductId },
      });
      expect(prismaMockService.cartProducts.delete).toHaveBeenCalledWith({
        where: { id: cartProductId },
      });
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if cart product not found', async () => {
      prismaMockService.cartProducts.findUnique.mockResolvedValueOnce(null);

      await expect(service.removeFromCart(cartProductId)).rejects.toThrow(
        new NotFoundException(`Cart item with ID ${cartProductId} not found`),
      );

      expect(prismaMockService.cartProducts.delete).not.toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    it('should clear cart successfully', async () => {
      prismaMockService.cart.findUnique.mockResolvedValueOnce(cartMock);
      prismaMockService.cartProducts.deleteMany.mockResolvedValueOnce({
        count: 3,
      });

      const result = await service.clearCart(cartId);

      expect(prismaMockService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: cartId },
      });
      expect(prismaMockService.cartProducts.deleteMany).toHaveBeenCalledWith({
        where: { cartId: cartMock.id },
      });
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if cart not found', async () => {
      prismaMockService.cart.findUnique.mockResolvedValueOnce(null);

      await expect(service.clearCart(cartId)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMockService.cartProducts.deleteMany).not.toHaveBeenCalled();
    });
  });
});
