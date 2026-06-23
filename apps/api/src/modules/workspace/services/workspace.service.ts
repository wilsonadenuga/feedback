import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto';
import { WORKSPACE_ROLES } from '@feedback/schema';
import { generateSlug } from '../../../common/helpers';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, data: CreateWorkspaceDto) {
    const defaultLabels = this.configService.get<string[]>('labels.defaults');

    const createData = {
      name: data.name,
      logo_url: data.logo_url,
      owner: {
        connect: {
          id: userId,
        },
      },
      members: {
        create: {
          user_id: userId,
          role: WORKSPACE_ROLES.OWNER,
        },
      },
      projects: {
        create: {
          name: 'Default Project',
          description: 'Your first project',
          labels: {
            create: defaultLabels.map((name) => ({
              name,
              slug: generateSlug(name),
              is_default: true,
            })),
          },
        },
      },
    };

    const workspace = await this.workspaceRepository.create(createData);
    if (workspace) {
      const { _count, ...rest } = workspace;
      return { ...rest, member_count: _count?.members ?? 0 };
    }
    return workspace;
  }

  async findAll(userId: string) {
    const workspaces = await this.workspaceRepository.findByUserId(userId);
    return workspaces.map((ws) => {
      const { _count, ...rest } = ws;
      return {
        ...rest,
        member_count: _count?.members ?? 0,
      };
    });
  }

  async findOne(workspaceId: string) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const { _count, ...rest } = workspace;
    return { ...rest, member_count: _count?.members ?? 0 };
  }

  async update(workspaceId: string, data: UpdateWorkspaceDto) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const updated = await this.workspaceRepository.update(workspaceId, {
      name: data.name,
      logo_url: data.logo_url,
    });
    const { _count, ...rest } = updated;
    return { ...rest, member_count: _count?.members ?? 0 };
  }

  async delete(workspaceId: string): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.workspaceRepository.delete(workspaceId);
  }
}
