import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectGuard } from '../guards';
import { ResponseHelper } from '../../../common';
import { ProjectSwagger } from '../../../swagger/project.swagger';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ProjectSwagger.create()
  async create(@Body() dto: CreateProjectDto) {
    const project = await this.projectService.create(dto.workspace_id, dto);
    return ResponseHelper.success(project, 'Project created successfully');
  }

  @Get(':project_id')
  @UseGuards(ProjectGuard)
  @ProjectSwagger.findOne()
  async findOne(@Param('project_id') projectId: string) {
    const project = await this.projectService.findOne(projectId);
    return ResponseHelper.success(project);
  }

  @Put(':project_id')
  @UseGuards(ProjectGuard)
  @ProjectSwagger.update()
  async update(
    @Param('project_id') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const project = await this.projectService.update(projectId, dto);
    return ResponseHelper.success(project, 'Project updated successfully');
  }

  @Delete(':project_id')
  @UseGuards(ProjectGuard)
  @ProjectSwagger.delete()
  async delete(@Param('project_id') projectId: string) {
    await this.projectService.delete(projectId);
    return ResponseHelper.success(null, 'Project deleted successfully');
  }
}
