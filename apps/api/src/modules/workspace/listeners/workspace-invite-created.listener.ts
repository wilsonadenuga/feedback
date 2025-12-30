import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { WorkspaceInvite } from '@feedback/email-templates';
import { WorkspaceInviteCreatedEvent } from '../events/workspace-invite-created.event';

@Injectable()
export class WorkspaceInviteCreatedListener {
  private readonly logger = new Logger(WorkspaceInviteCreatedEvent.name);

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('workspace.invite.created')
  async handleWorkspaceInviteCreated(event: WorkspaceInviteCreatedEvent) {
    this.logger.log(
      `Handling workspace.invite.created event for ${event.email}`,
    );

    try {
      const appUrl =
        this.configService.get<string>('APP_URL') || 'http://localhost:3000';
      const inviteUrl = `${appUrl}/invites/${event.inviteId}/accept?token=${event.token}`;

      const html = await render(
        WorkspaceInvite({
          workspaceName: event.workspaceName,
          inviterName: event.inviterName,
          inviteUrl,
        }),
      );

      await this.emailQueue.add(
        'send-email',
        {
          to: event.email,
          subject: `${event.inviterName} invited you to join ${event.workspaceName}`,
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

      this.logger.log(`Workspace invite email queued for ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue workspace invite email for ${event.email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
