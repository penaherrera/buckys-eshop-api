import {
  createEmailMockService,
  createJwtMockService,
  createPrismaMockService,
  createUsersMockService,
} from '../../common/mocks';
import { PasswordService } from './password.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from '../../email/services/email.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ResetPasswordDto } from '../../auth/dtos/requests/reset-password.dto';
import { userMock } from '../../common/mocks/mock';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;
  let prismaMockService;
  let jwtMockService;
  let usersMockService;
  let emailMockService;

  beforeEach(async () => {
    jest.clearAllMocks();
    prismaMockService = createPrismaMockService();
    jwtMockService = createJwtMockService();
    usersMockService = createUsersMockService();
    emailMockService = createEmailMockService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
        {
          provide: JwtService,
          useValue: jwtMockService,
        },
        {
          provide: UsersService,
          useValue: usersMockService,
        },
        {
          provide: EmailService,
          useValue: emailMockService,
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  describe('forgotPassword', () => {
    const email = 'test@example.com';
    const internalToken = 'abc12345';
    const jwtToken = 'jwt.token.here';

    beforeEach(() => {
      const { nanoid } = require('nanoid');
      nanoid.mockReturnValue(internalToken);
    });

    it('should send reset password email successfully', async () => {
      prismaMockService.user.findUnique.mockResolvedValueOnce(userMock);
      prismaMockService.user.update.mockResolvedValueOnce({
        ...userMock,
        resetPasswordToken: internalToken,
      });
      jwtMockService.sign.mockReturnValue(jwtToken);
      emailMockService.sendResetPasswordEmail.mockResolvedValueOnce(undefined);

      await service.forgotPassword(email);

      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(prismaMockService.user.update).toHaveBeenCalledWith({
        where: { id: userMock.id },
        data: {
          resetPasswordToken: internalToken,
        },
      });
      expect(jwtMockService.sign).toHaveBeenCalledWith(
        { sub: internalToken },
        { expiresIn: '1h' },
      );
      expect(emailMockService.sendResetPasswordEmail).toHaveBeenCalledWith(
        email,
        jwtToken,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaMockService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.forgotPassword(email)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaMockService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(prismaMockService.user.update).not.toHaveBeenCalled();
      expect(jwtMockService.sign).not.toHaveBeenCalled();
      expect(emailMockService.sendResetPasswordEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    const validToken = 'valid.jwt.token';
    const internalToken = '12345';
    const newPassword = 'newPassword123';
    const hashedPassword = 'hashedNewPassword';

    const resetPasswordDto: ResetPasswordDto = {
      password: newPassword,
      confirmationPassword: newPassword,
      token: validToken,
    };

    const userWithToken = {
      ...userMock,
      resetPasswordToken: internalToken,
    };

    it('should reset password successfully', async () => {
      jwtMockService.decode.mockReturnValue({ sub: internalToken });
      prismaMockService.user.findFirst.mockResolvedValueOnce(userWithToken);
      usersMockService.bcryptPassword.mockResolvedValueOnce(hashedPassword);
      prismaMockService.user.update.mockResolvedValueOnce({
        ...userWithToken,
        password: hashedPassword,
        resetPasswordToken: null,
      });

      await service.resetPassword(resetPasswordDto);

      expect(jwtMockService.verify).toHaveBeenCalledWith(validToken);
      expect(jwtMockService.decode).toHaveBeenCalledWith(validToken);
      expect(prismaMockService.user.findFirst).toHaveBeenCalledWith({
        where: { resetPasswordToken: internalToken },
      });
      expect(usersMockService.bcryptPassword).toHaveBeenCalledWith(newPassword);
      expect(prismaMockService.user.update).toHaveBeenCalledWith({
        where: { id: userWithToken.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
        },
      });
    });

    it('should throw BadRequestException if token is expired or invalid', async () => {
      jwtMockService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(jwtMockService.verify).toHaveBeenCalledWith(validToken);
      expect(jwtMockService.decode).not.toHaveBeenCalled();
      expect(prismaMockService.user.findFirst).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if user with token not found', async () => {
      jwtMockService.decode.mockReturnValue({ sub: internalToken });
      prismaMockService.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaMockService.user.findFirst).toHaveBeenCalledWith({
        where: { resetPasswordToken: internalToken },
      });
      expect(usersMockService.bcryptPassword).not.toHaveBeenCalled();
      expect(prismaMockService.user.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const mismatchedDto: ResetPasswordDto = {
        ...resetPasswordDto,
        confirmationPassword: 'differentPassword',
      };

      jwtMockService.decode.mockReturnValue({ sub: internalToken });
      prismaMockService.user.findFirst.mockResolvedValueOnce(userWithToken);

      await expect(service.resetPassword(mismatchedDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(usersMockService.bcryptPassword).not.toHaveBeenCalled();
      expect(prismaMockService.user.update).not.toHaveBeenCalled();
    });

    it('should handle token verification error correctly', async () => {
      const invalidTokenDto: ResetPasswordDto = {
        ...resetPasswordDto,
        token: 'invalid.token',
      };

      jwtMockService.verify.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(service.resetPassword(invalidTokenDto)).rejects.toThrow(
        new BadRequestException('Expired or invalid token'),
      );
      expect(jwtMockService.verify).toHaveBeenCalledWith('invalid.token');
    });
  });
});
