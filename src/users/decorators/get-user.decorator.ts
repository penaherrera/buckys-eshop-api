import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): UserEntity => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
