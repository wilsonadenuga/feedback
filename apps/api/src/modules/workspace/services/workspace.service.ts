import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto';
import { violatesUnique } from '../../../prisma/unique-constraint';
import { generateSlug } from '../../../common/helpers';

function handleTakenError(handle: string) {
  return new ConflictException(
    `The workspace address "${handle}" is already taken.`,
  );
}

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, data: CreateWorkspaceDto) {
    const defaultLabels = this.configService
      .get<string[]>('labels.defaults')
      .map((name) => ({
        name,
        slug: generateSlug(name),
        is_default: true,
      }));

    try {
      const workspace = await this.workspaceRepository.create(
        data,
        userId,
        defaultLabels,
      );

      const { _count, ...rest } = workspace;
      return { ...rest, member_count: _count?.members ?? 0 };
    } catch (error) {
      if (violatesUnique(error, 'handle')) {
        throw handleTakenError(data.handle);
      }
      throw error;
    }
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
    return {
      ...rest,
      member_count: _count?.members ?? 0,
    };
  }

  async update(workspaceId: string, data: UpdateWorkspaceDto) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    try {
      const updated = await this.workspaceRepository.update(workspaceId, {
        name: data.name,
        handle: data.handle,
        logo_url: data.logo_url,
      });

      const { _count, ...rest } = updated;
      return { ...rest, member_count: _count?.members ?? 0 };
    } catch (error) {
      if (data.handle && violatesUnique(error, 'handle')) {
        throw handleTakenError(data.handle);
      }
      throw error;
    }
  }

  async delete(workspaceId: string): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.workspaceRepository.delete(workspaceId);
  }
}
