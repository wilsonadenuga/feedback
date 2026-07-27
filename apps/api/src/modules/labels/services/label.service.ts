import { Injectable, NotFoundException } from '@nestjs/common';
import { LabelRepository } from '../repositories/label.repository';
import { CreateLabelDto, UpdateLabelDto } from '../dto';
import { generateSlug } from '../../../common/helpers';

@Injectable()
export class LabelService {
  constructor(private readonly labelRepository: LabelRepository) {}

  async create(workspaceId: string, data: CreateLabelDto) {
    return this.labelRepository.create({
      name: data.name,
      slug: generateSlug(data.name),
      description: data.description,
      color: data.color,
      is_default: false,
      workspace: {
        connect: {
          id: workspaceId,
        },
      },
    });
  }

  async findOne(labelId: string) {
    const label = await this.labelRepository.findById(labelId);

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    return label;
  }

  async update(labelId: string, data: UpdateLabelDto) {
    const label = await this.labelRepository.findById(labelId);

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    return this.labelRepository.update(labelId, {
      name: data.name,
      description: data.description,
      color: data.color,
      ...(data.name && { slug: generateSlug(data.name) }),
    });
  }

  async delete(labelId: string): Promise<void> {
    const label = await this.labelRepository.findById(labelId);

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    await this.labelRepository.delete(labelId);
  }

  async findByWorkspaceId(workspaceId: string) {
    return this.labelRepository.findByWorkspaceId(workspaceId);
  }
}
