import { Module } from '@nestjs/common';
import { WorkspaceController } from './controllers/workspace.controller';
import { WorkspaceService } from './services/workspace.service';
import { WorkspaceMemberService } from './services/workspace-member.service';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceMemberRepository } from './repositories/workspace-member.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceMemberService,
    WorkspaceRepository,
    WorkspaceMemberRepository,
  ],
  exports: [
    WorkspaceService,
    WorkspaceMemberService,
    WorkspaceRepository,
    WorkspaceMemberRepository,
  ],
})
export class WorkspaceModule {}
