import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from './services/email.service';
import { ResendService } from './services/resend.service';
import { EmailProcessor } from './processors/email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, ResendService, EmailProcessor],
  exports: [],
})
export class EmailsModule {}
