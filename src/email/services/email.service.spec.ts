import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { SendGridClient } from '../sendgrid-client';
import { InternalServerErrorException, ConsoleLogger } from '@nestjs/common';
import { loggerMock } from '../../common/mocks/mock';
import { createSendgridMockClient } from '../../common/mocks';

describe('EmailService', () => {
  let service: EmailService;
  let sendgridMockClient;

  beforeEach(async () => {
    sendgridMockClient = createSendgridMockClient();

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: SendGridClient,
          useValue: sendgridMockClient,
        },
      ],
    })
      .setLogger(loggerMock as unknown as ConsoleLogger)
      .compile();

    service = module.get<EmailService>(EmailService);
  });

  describe('sendResetPasswordEmail', () => {
    const recipient = 'test@example.com';
    const jwtToken = 'test-jwt-token';

    it('should send reset password email successfully', async () => {
      sendgridMockClient.send.mockResolvedValue([{}, {}]);

      await service.sendResetPasswordEmail(recipient, jwtToken);

      expect(sendgridMockClient.send).toHaveBeenCalledWith({
        to: recipient,
        from: 'carlospena@ravn.co',
        subject: 'Password Reset Token',
        html: expect.stringContaining(jwtToken),
        text: expect.stringContaining(jwtToken),
      });
    });

    it('should throw InternalServerErrorException when SendGrid fails', async () => {
      const error = new Error('SendGrid error');
      sendgridMockClient.send.mockRejectedValue(error);

      await expect(
        service.sendResetPasswordEmail(recipient, jwtToken),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
