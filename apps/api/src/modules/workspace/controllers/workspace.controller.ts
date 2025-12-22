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
import { WorkspaceService } from '../services/workspace.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../guards';
import { ResponseHelper, GetCurrentUser } from '../../../common';
import { WorkspaceSwagger } from '../../../swagger/workspace.swagger';

@ApiTags('workspaces')
@ApiBearerAuth()
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @WorkspaceSwagger.create()
  async create(
    @GetCurrentUser('id') userId: string,
    @Body() dto: CreateWorkspaceDto,
  ) {
    const workspace = await this.workspaceService.create(userId, dto);
    return ResponseHelper.success(workspace, 'Workspace created successfully');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @WorkspaceSwagger.findAll()
  async findAll(@GetCurrentUser('id') userId: string) {
    const workspaces = await this.workspaceService.findAll(userId);
    return ResponseHelper.success(
      workspaces,
      'Workspaces retrieved successfully',
    );
  }

  @Get(':workspace_id')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @WorkspaceSwagger.findOne()
  async findOne(@Param('workspace_id') workspaceId: string) {
    const workspace = await this.workspaceService.findOne(workspaceId);
    return ResponseHelper.success(workspace);
  }

  @Get(':workspace_id/projects')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @WorkspaceSwagger.getProjects()
  async getProjects(@Param('workspace_id') workspaceId: string) {
    const projects = await this.workspaceService.getProjects(workspaceId);
    return ResponseHelper.success(projects, 'Projects retrieved successfully');
  }

  @Put(':workspace_id')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @WorkspaceSwagger.update()
  async update(
    @Param('workspace_id') workspaceId: string,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    const workspace = await this.workspaceService.update(workspaceId, dto);
    return ResponseHelper.success(workspace, 'Workspace updated successfully');
  }

  @Delete(':workspace_id')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @WorkspaceSwagger.delete()
  async delete(@Param('workspace_id') workspaceId: string) {
    await this.workspaceService.delete(workspaceId);
    return ResponseHelper.success(null, 'Workspace deleted successfully');
  }
}
