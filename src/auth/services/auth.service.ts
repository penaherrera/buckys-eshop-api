import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { AuthCredentialsDto } from '../dtos/requests/auth-credentials.dto';
import { LogInData } from '../interfaces/sign-in-data.interface';
import { JwtResponseDto } from '../dtos/responses/jwt-response.dto';
import { CreateUserDto } from '../../users/dtos/requests/create-user.dto';
import { AuthResponseDto } from '../dtos/responses/auth-response.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtPayloadAuth } from '../interfaces/jwt-payload-auth.interface';
import { compare } from 'bcryptjs';
import { Auth } from '@prisma/client';
import { hasExpired } from '../../common/utils/has-expired';
import authConfig from '../config/auth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(userId: number): Promise<Auth> {
    const { jwtExpiration, jwtRefreshExpiration } = this.authConfiguration;

    const now = new Date();
    const refreshExpiresAt = new Date(
      now.setMinutes(
        now.getMinutes() +
          (parseInt(jwtExpiration) + parseInt(jwtRefreshExpiration)),
      ),
    );

    const jti = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();

    const auth = await this.prismaService.auth.create({
      data: {
        createdAt: now,
        userId,
        refreshExpiresAt,
        jti,
        refreshToken,
      },
    });

    return auth;
  }

  async validateUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<LogInData> {
    const { email, password } = authCredentialsDto;

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      email: user.email,
    };
  }

  async logIn(loginData: LogInData): Promise<JwtResponseDto> {
    const token = await this.createAccessToken(loginData.userId);
    return token;
  }

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.create(createUserDto);
  }

  async createAccessToken(
    id: number,
    expiresIn?: string,
  ): Promise<AuthResponseDto> {
    const auth = await this.create(id);
    return this.generateJwt(auth, expiresIn);
  }

  private generateJwt(auth: Auth, expiresIn?: string): JwtResponseDto {
    const payload: JwtPayloadAuth = {
      jti: auth.jti,
    };

    const accessToken = this.jwtService.sign(payload, {
      ...(expiresIn && { expiresIn }),
    });
    const { refreshToken, refreshExpiresAt } = auth;

    return {
      accessToken,
      refreshToken,
      refreshExpiresAt: refreshExpiresAt.getTime(),
    };
  }

  async refreshToken(refreshToken: string): Promise<JwtResponseDto> {
    const auth = await this.refreshAuthToken(refreshToken);
    return this.generateJwt(auth);
  }

  async refreshAuthToken(refreshToken: string): Promise<Auth> {
    const auth = await this.prismaService.auth.findFirst({
      where: { refreshToken },
      include: { user: true },
    });

    if (!auth) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (hasExpired(auth.refreshExpiresAt)) {
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.prismaService.auth.delete({
      where: { id: auth.id },
    });

    const response = await this.create(auth.userId);

    return response;
  }
}
