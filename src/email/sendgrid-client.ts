import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailDataRequired, default as SendGrid } from '@sendgrid/mail';
import emailConfig from './config/email.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class SendGridClient {
  private logger: Logger;
  constructor(
    @Inject(emailConfig.KEY)
    private readonly emailConfiguration: ConfigType<typeof emailConfig>,
  ) {
    this.logger = new Logger(SendGridClient.name);
    SendGrid.setApiKey(this.emailConfiguration.sendgridApiKey);
  }

  async send(mail: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(mail);
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
    } catch (error) {
      this.logger.error('Error while sending email', error);
      throw error;
    }
  }
}
