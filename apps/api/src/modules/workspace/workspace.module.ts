import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WorkspaceController } from './controllers/workspace.controller';
import { InviteController } from './controllers/invite.controller';
import { WorkspaceService } from './services/workspace.service';
import { WorkspaceMemberService } from './services/workspace-member.service';
import { WorkspaceInviteService } from './services/workspace-invite.service';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceMemberRepository } from './repositories/workspace-member.repository';
import { WorkspaceInviteRepository } from './repositories/workspace-invite.repository';
import { WorkspaceInviteCreatedListener } from './listeners/workspace-invite-created.listener';
import { WorkspaceGuard } from './guards';
import { PrismaModule } from '../../prisma/prisma.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    UserModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [WorkspaceController, InviteController],
  providers: [
    WorkspaceService,
    WorkspaceMemberService,
    WorkspaceInviteService,
    WorkspaceRepository,
    WorkspaceMemberRepository,
    WorkspaceInviteRepository,
    WorkspaceInviteCreatedListener,
    WorkspaceGuard,
  ],
  exports: [
    WorkspaceService,
    WorkspaceMemberService,
    WorkspaceInviteService,
    WorkspaceRepository,
    WorkspaceMemberRepository,
    WorkspaceGuard,
  ],
})
export class WorkspaceModule {}
