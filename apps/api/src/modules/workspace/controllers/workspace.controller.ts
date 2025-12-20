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
import { ResponseHelper, GetCurrentUser } from '../../../common';

@ApiTags('workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(
    @GetCurrentUser('sub') userId: string,
    @Body() dto: CreateWorkspaceDto,
  ) {
    const workspace = await this.workspaceService.create(userId, dto);
    return ResponseHelper.success(workspace, 'Workspace created successfully');
  }

  @Get()
  async findAll(@GetCurrentUser('sub') userId: string) {
    const workspaces = await this.workspaceService.findAll(userId);
    return ResponseHelper.success(workspaces);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const workspace = await this.workspaceService.findOne(id);
    return ResponseHelper.success(workspace);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto) {
    const workspace = await this.workspaceService.update(id, dto);
    return ResponseHelper.success(workspace, 'Workspace updated successfully');
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.workspaceService.delete(id);
    return ResponseHelper.success(null, 'Workspace deleted successfully');
  }
}
