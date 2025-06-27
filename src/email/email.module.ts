import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { SendGridClient } from './sendgrid-client';
import emailConfig from './config/email.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(emailConfig)],
  providers: [EmailService, SendGridClient],
  exports: [EmailService],
})
export class EmailModule {}
