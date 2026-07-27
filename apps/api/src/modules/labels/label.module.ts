import { Module } from '@nestjs/common';
import { LabelController } from './controllers/label.controller';
import { LabelService } from './services/label.service';
import { LabelRepository } from './repositories/label.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [PrismaModule, WorkspaceModule],
  controllers: [LabelController],
  providers: [LabelService, LabelRepository],
  exports: [LabelService, LabelRepository],
})
export class LabelModule {}
