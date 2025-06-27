import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { authMock, userMock } from '../../common/mocks/mock';
import { compare } from 'bcryptjs';
import { UsersService } from '../../users/services/users.service';
import {
  createJwtMockService,
  createPrismaMockService,
  createUsersMockService,
} from '../../common/mocks';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from '../dtos/requests/auth-credentials.dto';
import { LogInData } from '../interfaces/sign-in-data.interface';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaMockService = createPrismaMockService();
  let usersMockService = createUsersMockService();
  let jwtMockService = createJwtMockService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
        {
          provide: UsersService,
          useValue: usersMockService,
        },
        {
          provide: JwtService,
          useValue: jwtMockService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  const params = {
    id: 1,
    expiresIn: '1h',
  };

  describe('createAccessToken', () => {
    it('should return an access token', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(authMock);
      jest.spyOn(service['jwtService'], 'sign').mockReturnValue('mock-token');

      const result = await service.createAccessToken(
        params.id,
        params.expiresIn,
      );

      expect(result).toEqual({
        accessToken: 'mock-token',
        refreshToken: authMock.refreshToken,
        refreshExpiresAt: authMock.refreshExpiresAt.getTime(),
      });

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(params.id);

      expect(service['jwtService'].sign).toHaveBeenCalledWith(
        { jti: authMock.jti },
        { expiresIn: params.expiresIn },
      );
    });
  });

  describe('validateUser', () => {
    const expectedResult: LogInData = {
      userId: 1,
      email: 'carlospena@yopmail.com',
    };

    it('should validate and return user when credentials are valid', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'carlospena@yopmail.com',
        password: 'Nestjs1*',
      };

      usersMockService.findUserByEmail.mockResolvedValueOnce(userMock);
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser(authCredentialsDto);

      expect(result).toEqual(expectedResult);
      expect(usersMockService.findUserByEmail).toHaveBeenCalledWith(
        authCredentialsDto.email,
      );

      expect(compare).toHaveBeenCalledWith(
        authCredentialsDto.password,
        userMock.password,
      );
    });

    it('should throw an UnauthorizedException when user is not valid', async () => {
      const invalidAuthCredentialsDto = {
        email: 'carlospena@yopmail.com',
        password: 'DifferentPassword1*',
      };

      usersMockService.findUserByEmail.mockResolvedValueOnce(userMock);
      (compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        service.validateUser(invalidAuthCredentialsDto),
      ).rejects.toThrow(UnauthorizedException);

      expect(compare).toHaveBeenCalledWith(
        invalidAuthCredentialsDto.password,
        userMock.password,
      );
    });
  });

  describe('create', () => {
    it('should create a new Auth record', async () => {
      const userId = 1;

      prismaMockService.auth.create.mockResolvedValueOnce(authMock);

      const result = await service.create(userId);

      expect(result).toEqual(authMock);
      expect(prismaMockService.auth.create).toHaveBeenCalledWith({
        data: {
          userId,
          refreshToken: expect.any(String),
          refreshExpiresAt: expect.any(Date),
          jti: expect.any(String),
          createdAt: expect.any(Date),
        },
      });
    });
  });

  describe('refreshAuthToken', () => {
    it('should refresh an auth token', async () => {
      const refreshToken = 'valid-refresh-token';
      const existingAuth = {
        ...authMock,
        user: userMock,
        refreshExpiresAt: new Date(Date.now() + 3600000), // Future date
      };

      prismaMockService.auth.findFirst.mockResolvedValueOnce(existingAuth);
      prismaMockService.auth.delete.mockResolvedValueOnce(existingAuth);
      jest.spyOn(service, 'create').mockResolvedValueOnce(authMock);

      const result = await service.refreshAuthToken(refreshToken);

      expect(result).toEqual(authMock);
      expect(prismaMockService.auth.findFirst).toHaveBeenCalledWith({
        where: { refreshToken },
        include: { user: true },
      });
      expect(prismaMockService.auth.delete).toHaveBeenCalledWith({
        where: { id: existingAuth.id },
      });
      expect(service.create).toHaveBeenCalledWith(existingAuth.userId);
    });

    it('should throw UnauthorizedException if refresh token not found', async () => {
      const refreshToken = 'invalid-refresh-token';

      prismaMockService.auth.findFirst.mockResolvedValueOnce(null);

      await expect(service.refreshAuthToken(refreshToken)).rejects.toThrow(
        new UnauthorizedException('Refresh token not found'),
      );
    });

    it('should throw UnauthorizedException if refresh token expired', async () => {
      const refreshToken = 'expired-refresh-token';
      const expiredAuth = {
        ...authMock,
        user: userMock,
        refreshExpiresAt: new Date(Date.now() - 3600000), // Past date
      };

      prismaMockService.auth.findFirst.mockResolvedValueOnce(expiredAuth);

      await expect(service.refreshAuthToken(refreshToken)).rejects.toThrow(
        new UnauthorizedException('Refresh token expired'),
      );
    });
  });
  describe('refreshToken', () => {
    it('should return new JWT tokens', async () => {
      const refreshToken = 'valid-refresh-token';
      const newAuth = authMock;
      const expectedResult = {
        accessToken: 'new-access-token',
        refreshToken: newAuth.refreshToken,
        refreshExpiresAt: newAuth.refreshExpiresAt.getTime(),
      };

      jest.spyOn(service, 'refreshAuthToken').mockResolvedValueOnce(newAuth);

      jest
        .spyOn(jwtMockService, 'sign')
        .mockReturnValueOnce('new-access-token');

      const result = await service.refreshToken(refreshToken);

      expect(result).toEqual(expectedResult);
      expect(service.refreshAuthToken).toHaveBeenCalledWith(refreshToken);
      expect(jwtMockService.sign).toHaveBeenCalledWith(
        { jti: newAuth.jti },
        {},
      );
    });
  });
});
