import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectGuard } from './guards';
import { PrismaModule } from '../../prisma/prisma.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { LabelModule } from '../labels/label.module';

@Module({
  imports: [PrismaModule, WorkspaceModule, forwardRef(() => LabelModule)],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, ProjectGuard],
  exports: [ProjectService, ProjectRepository, ProjectGuard],
})
export class ProjectModule {}
