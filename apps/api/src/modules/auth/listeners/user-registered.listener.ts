import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { render } from '@react-email/components';
import { ConfirmEmail } from '@feedback/email-templates';
import { UserRegisteredEvent } from '../events/user-registered.event';

@Injectable()
export class UserRegisteredEventListener {
  private readonly logger = new Logger(UserRegisteredEvent.name);

  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent('user.registered')
  async handleSendOtpEvent(event: UserRegisteredEvent) {
    this.logger.log(`Handling user.registered event for ${event.email}`);

    try {
      const html = await render(ConfirmEmail({ validationCode: event.validationCode }));

      await this.emailQueue.add(
        'send-email',
        {
          to: event.email,
          subject: 'Confirm your email address',
          html,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );

      this.logger.log(`OTP email queued for ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue OTP email for ${event.email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
