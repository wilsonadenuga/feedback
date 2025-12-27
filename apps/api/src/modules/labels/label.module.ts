import { Module, forwardRef } from '@nestjs/common';
import { LabelController } from './controllers/label.controller';
import { LabelService } from './services/label.service';
import { LabelRepository } from './repositories/label.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ProjectModule } from '../projects/project.module';

@Module({
  imports: [PrismaModule, WorkspaceModule, forwardRef(() => ProjectModule)],
  controllers: [LabelController],
  providers: [LabelService, LabelRepository],
  exports: [LabelService, LabelRepository],
})
export class LabelModule {}
