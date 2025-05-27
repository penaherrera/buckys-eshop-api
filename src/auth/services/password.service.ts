import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from '../../auth/dtos/requests/reset-password.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from 'src/users/services/users.service';
import { nanoid } from 'nanoid';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PasswordService {
  protected readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const internalToken = nanoid(8);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: internalToken,
      },
    });

    const jwtToken = this.jwtService.sign(
      { sub: internalToken },
      { expiresIn: '1h' },
    );

    await this.emailService.sendResetPasswordEmail(email, jwtToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const {
      password: newPassword,
      confirmationPassword,
      token,
    } = resetPasswordDto;

    try {
      this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Expired or invalid token');
    }

    const decoded = this.jwtService.decode(token) as { sub: string };
    const user = await this.prismaService.user.findFirst({
      where: { resetPasswordToken: decoded.sub },
    });

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    if (newPassword !== confirmationPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await this.usersService.bcryptPassword(newPassword);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
      },
    });
  }
}
