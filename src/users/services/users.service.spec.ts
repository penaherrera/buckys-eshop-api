import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { roleMock, userMock } from '../../common/mocks/mock';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { UserDto } from '../dtos/responses/user.dto';
import { createPrismaMockService } from '../../common/mocks';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMockService = createPrismaMockService();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  const params: CreateUserDto = {
    firstName: 'Francisco',
    lastName: 'Herrera',
    email: 'franciscoherrera@yopmail.com',
    address: 'Fake address at 123 main st',
    phoneNumber: '+51987654321',
    password: 'Nestjs1*',
  };

  describe('findUserByEmail', () => {
    it('should return an user', async () => {
      const existingUser = userMock;

      prismaMockService.user.findUnique.mockResolvedValue(userMock);

      const result = await service.findUserByEmail(userMock.email);

      expect(result).toEqual(existingUser);
      expect(prismaMockService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: existingUser.email,
        },
        include: {
          role: true,
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const nonExistingEmail = 'notanuser@notexisting.com';

      prismaMockService.user.findUnique.mockResolvedValue(null);

      await expect(service.findUserByEmail(nonExistingEmail)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(prismaMockService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: nonExistingEmail,
        },
        include: {
          role: true,
        },
      });
    });
  });

  describe('create', () => {
    const role = roleMock;

    it('should create an user', async () => {
      prismaMockService.user.findUnique.mockResolvedValue(null);
      prismaMockService.role.findUnique.mockResolvedValue(roleMock);

      await service.create(params);

      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { email: params.email },
      });

      expect(prismaMockService.role.findUnique).toHaveBeenCalledWith({
        where: { slug: 'client' },
      });

      expect(prismaMockService.user.create).toHaveBeenCalledWith({
        data: {
          ...params,
          password: expect.any(String),
          roleId: role.id,
          createdAt: expect.any(Date),
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      params.email = 'carlospena@yopmail.com';

      prismaMockService.user.findUnique.mockResolvedValue(userMock);

      await expect(service.create(params)).rejects.toThrow(ConflictException);

      expect(prismaMockService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { email: params.email },
      });
      expect(prismaMockService.role.findUnique).not.toHaveBeenCalled();
      expect(prismaMockService.user.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if role not found', async () => {
      prismaMockService.user.findUnique.mockResolvedValue(null);
      prismaMockService.role.findUnique.mockResolvedValue(null);

      await expect(service.create(params)).rejects.toThrow(NotFoundException);

      expect(prismaMockService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMockService.role.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { email: params.email },
      });
      expect(prismaMockService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const userId = 1;
    const updateData = {
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
      address: 'Updated Address',
      phoneNumber: '+51999999999',
    };

    it('should update an existing user', async () => {
      prismaMockService.user.findUnique.mockResolvedValue(userMock);

      prismaMockService.user.update.mockResolvedValue({
        ...userMock,
        ...updateData,
      });

      const result = await service.update(userId, updateData);

      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });

      expect(prismaMockService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });

      expect(result).toBeInstanceOf(UserDto);

      expect(result).toEqual(
        expect.objectContaining({
          id: userId,
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          address: updateData.address,
          phoneNumber: updateData.phoneNumber,
        }),
      );
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaMockService.user.findUnique.mockResolvedValue(null);

      await expect(service.update(userId, updateData)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaMockService.user.update).not.toHaveBeenCalled();
    });
  });
});
