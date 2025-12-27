import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProjectRepository } from '../repositories/project.repository';
import { CreateProjectDto, UpdateProjectDto } from '../dto';
import { Prisma } from '../../../../generated/client/browser';
import { generateSlug } from '../../../common/helpers';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(workspaceId: string, data: CreateProjectDto) {
    const defaultCategories = this.configService.get<string[]>(
      'categories.defaults',
    );

    return this.projectRepository.create({
      name: data.name,
      description: data.description,
      workspace: {
        connect: {
          id: workspaceId,
        },
      },
      categories: {
        create: defaultCategories.map((name) => ({
          name,
          slug: generateSlug(name),
          is_default: true,
        })),
      },
    });
  }

  async validateUserAccess(projectId: string, userId: string) {
    const result = await this.projectRepository.validateUserAccess(
      projectId,
      userId,
    );

    if (!result) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return result;
  }

  async findOne(projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(projectId: string, data: UpdateProjectDto) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const updateData: Prisma.ProjectUpdateInput = {
      name: data.name,
      description: data.description,
    };

    return this.projectRepository.update(projectId, updateData);
  }

  async delete(projectId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.delete(projectId);
  }
}
