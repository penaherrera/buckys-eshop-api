import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadAuth } from '../interfaces/jwt-payload-auth.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadAuth): Promise<UserEntity> {
    const { jti } = payload;

    const auth = await this.prisma.auth.findUnique({
      where: { jti },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!auth || !auth.user) {
      throw new UnauthorizedException('Invalid Token');
    }

    const user = {
      ...auth.user,
      role: auth.user.role,
      createdAt: auth.user.createdAt,
      updatedAt: auth.user.updatedAt,
    };

    return user;
  }
}
