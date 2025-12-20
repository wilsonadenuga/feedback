import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { render } from '@react-email/components';
import { LoginCode } from '@feedback/email-templates';
import { UserLoginCodeEvent } from '../events/user-login-code.event';

@Injectable()
export class UserLoginCodeEventListener {
  private readonly logger = new Logger(UserLoginCodeEvent.name);

  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent('user.login.code')
  async handleLoginCodeEvent(event: UserLoginCodeEvent) {
    this.logger.log(`Handling user.login.code event for ${event.email}`);

    try {
      const html = await render(
        LoginCode({
          code: event.code,
        }),
      );

      await this.emailQueue.add(
        'send-email',
        {
          to: event.email,
          subject: 'Your login code',
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

      this.logger.log(`Login code email queued for ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue login code email for ${event.email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
