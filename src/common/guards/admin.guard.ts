import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;

    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: request.user.id },
      include: { role: true },
    });

    if (!user?.role) {
      throw new ForbiddenException('User role not found');
    }

    if (user.role.slug !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
