import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendGridClient } from './sendgrid-client';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [EmailService, SendGridClient],
  exports: [EmailService],
})
export class EmailModule {}
