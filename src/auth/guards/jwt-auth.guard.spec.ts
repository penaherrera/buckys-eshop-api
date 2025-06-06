import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  createMockExecutionContext,
  createMockGqlContext,
} from '../../common/mocks';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockExecutionContext: ExecutionContext;
  let mockGqlContext;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockExecutionContext = createMockExecutionContext();
    mockGqlContext = createMockGqlContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext);
  });

  describe('getRequest', () => {
    it('should return GraphQL request when context type is graphql', () => {
      const mockRequest = { user: { id: 1 }, headers: {} };

      mockExecutionContext.getType = jest.fn().mockReturnValue('graphql');
      mockGqlContext.getContext.mockReturnValue({ req: mockRequest });

      const result = guard.getRequest(mockExecutionContext);

      expect(mockExecutionContext.getType).toHaveBeenCalled();
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(
        mockExecutionContext,
      );
      expect(mockGqlContext.getContext).toHaveBeenCalled();
      expect(result).toBe(mockRequest);
    });

    it('should return HTTP request when context type is not graphql', () => {
      const mockRequest = { user: { id: 1 }, headers: {} };
      const mockHttpContext = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
      };

      mockExecutionContext.getType = jest.fn().mockReturnValue('http');
      mockExecutionContext.switchToHttp = jest
        .fn()
        .mockReturnValue(mockHttpContext);

      const result = guard.getRequest(mockExecutionContext);

      expect(mockExecutionContext.getType).toHaveBeenCalled();
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockHttpContext.getRequest).toHaveBeenCalled();
      expect(result).toBe(mockRequest);
      expect(GqlExecutionContext.create).not.toHaveBeenCalled();
    });
  });
});
