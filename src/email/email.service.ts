import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendGridClient } from './sendgrid-client';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly sendGridClient: SendGridClient) {}

  async sendResetPasswordEmail(
    recipient: string,
    jwtToken: string,
  ): Promise<void> {
    const htmlContent = `
      <p>Use the following token to reset your password via the <code>/reset-password</code> API:</p>
      <pre>${jwtToken}</pre>
      <p>This token will expire in 1 hour.</p>
    `;

    const mail: MailDataRequired = {
      to: recipient,
      from: 'carlospena@ravn.co',
      subject: 'Password Reset Token',
      html: htmlContent,
      text: `Reset your password using this token:\n\n${jwtToken}\n\nExpires in 1 hour.`,
    };

    try {
      await this.sendGridClient.send(mail);
      this.logger.log(`Password reset token sent to ${recipient}`);
    } catch (error) {
      this.logger.error(`Failed to send reset password token`, error.stack);
      throw new InternalServerErrorException(
        'Failed to send reset password token',
      );
    }
  }
}
