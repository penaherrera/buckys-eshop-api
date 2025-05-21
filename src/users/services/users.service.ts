import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { User } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      this.logger.log(`User with email ${email} doest not exist`);
      throw new UnauthorizedException('User does not exist');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { email } = createUserDto;
    const roleSlug = 'client';

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const role = await this.prismaService.role.findUnique({
      where: { slug: roleSlug },
    });

    if (!role) {
      this.logger.error('Role not found', { roleSlug });
      throw new NotFoundException('Role not found');
    }

    await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await this.bcryptPassword(createUserDto.password),
        roleId: role.id,
        createdAt: new Date(),
      },
    });

    this.logger.log('User created successfully');
  }

  private async bcryptPassword(password: string): Promise<string> {
    const salt: string = await genSalt();
    return hash(password, salt);
  }
}
