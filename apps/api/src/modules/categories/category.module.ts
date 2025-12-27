import { Module, forwardRef } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ProjectModule } from '../projects/project.module';

@Module({
  imports: [PrismaModule, WorkspaceModule, forwardRef(() => ProjectModule)],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
