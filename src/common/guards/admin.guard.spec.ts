import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { PrismaService } from '../prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  createMockExecutionContext,
  createMockGqlContext,
  createPrismaMockService,
} from '../mocks';
import { adminRoleMock, clientRoleMock, userMock } from '../mocks/mock';
import { UserEntity } from '../../users/entities/user.entity';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let prismaMockService;
  let mockExecutionContext;
  let mockGqlContext;

  const createMockRequest = (
    user: UserEntity | null | undefined = userMock,
  ) => ({
    user,
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    prismaMockService = createPrismaMockService();
    mockExecutionContext = createMockExecutionContext();
    mockGqlContext = createMockGqlContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext);
    mockGqlContext.getContext.mockReturnValue({ req: createMockRequest() });
  });

  describe('canActivate', () => {
    it('should throw UnauthorizedException when user is not authenticated', async () => {
      mockGqlContext.getContext.mockReturnValue({
        req: createMockRequest(null),
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw ForbiddenException when user is not found in database', async () => {
      const mockUser = { ...userMock, id: 9999 };
      mockGqlContext.getContext.mockReturnValue({
        req: createMockRequest(mockUser),
      });
      prismaMockService.user.findUnique.mockResolvedValueOnce(null);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when user has no role', async () => {
      mockGqlContext.getContext.mockReturnValue({
        req: createMockRequest(userMock),
      });

      prismaMockService.user.findUnique.mockResolvedValueOnce({
        id: userMock.id,
        email: 'user@example.com',
        role: null,
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when user role is not admin', async () => {
      mockGqlContext.getContext.mockReturnValue({
        req: createMockRequest(userMock),
      });

      prismaMockService.user.findUnique.mockResolvedValueOnce({
        id: userMock.id,
        email: 'user@example.com',
        role: clientRoleMock,
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return true when user has admin role', async () => {
      mockGqlContext.getContext.mockReturnValue({
        req: createMockRequest(userMock),
      });

      prismaMockService.user.findUnique.mockResolvedValueOnce({
        id: userMock.id,
        email: 'admin@example.com',
        role: adminRoleMock,
      });

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userMock.id },
        include: { role: true },
      });
    });

    it('should call PrismaService with correct parameters', async () => {
      mockGqlContext.getContext.mockReturnValue({
        req: createMockRequest(userMock),
      });

      prismaMockService.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'admin@example.com',
        role: adminRoleMock,
      });

      await guard.canActivate(mockExecutionContext);

      expect(prismaMockService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { role: true },
      });
    });

    it('should create GqlExecutionContext correctly', async () => {
      mockGqlContext.getContext.mockReturnValue({
        req: createMockRequest(userMock),
      });

      prismaMockService.user.findUnique.mockResolvedValueOnce({
        id: userMock.id,
        email: 'admin@example.com',
        role: adminRoleMock,
      });

      await guard.canActivate(mockExecutionContext);

      expect(GqlExecutionContext.create).toHaveBeenCalledWith(
        mockExecutionContext,
      );
      expect(mockGqlContext.getContext).toHaveBeenCalled();
    });
  });
});
