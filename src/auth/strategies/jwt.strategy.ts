import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadAuth } from '../interfaces/jwt-payload-auth.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { PrismaService } from '../../common/prisma/prisma.service';
import authConfig from '../config/auth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfiguration.jwtSecret,
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
