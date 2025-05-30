import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserInput } from '../dtos/requests/update-user.input';
import { UserDto } from '../dtos/responses/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      this.logger.log(`User with email ${email} doest not exist`);
      throw new UnauthorizedException('Invalid credentials');
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

  async update(
    userId: number,
    updateUserInput: UpdateUserInput,
  ): Promise<UserDto> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new Error('User not found');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: { ...updateUserInput },
    });

    this.logger.log(`User updated successfully`);
    return plainToInstance(UserDto, updatedUser);
  }

  async bcryptPassword(password: string): Promise<string> {
    const salt: string = await genSalt();
    return hash(password, salt);
  }
}
