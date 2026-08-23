import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto';
import { Prisma } from '../../../../generated/client/client';

/** P2002 is a unique-constraint violation — match the handle's constraint, not the labels' slug. */
function isHandleTaken(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== 'P2002') return false;

  const target = error.meta?.target;
  return Array.isArray(target) && target.length === 1 && target[0] === 'handle';
}

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, data: CreateWorkspaceDto) {
    const defaultLabels = this.configService.get<string[]>('labels.defaults');

    try {
      const workspace = await this.workspaceRepository.create(
        data,
        userId,
        defaultLabels,
      );

      const { _count, ...rest } = workspace;
      return { ...rest, member_count: _count?.members ?? 0 };
    } catch (error) {
      if (isHandleTaken(error)) {
        throw new ConflictException(
          `The workspace address "${data.handle}" is already taken.`,
        );
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
