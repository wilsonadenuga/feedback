import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from '../repositories/feedback.repository';
import {
  CreateFeedbackDto,
  GetFeedbacksDto,
  UpdateFeedbackStatusDto,
} from '../dto';
import { Prisma } from '../../../../generated/client/client';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async create(authorId: string, data: CreateFeedbackDto) {
    return this.feedbackRepository.create({
      title: data.title,
      description: data.description,
      workspace: {
        connect: {
          id: data.workspace_id,
        },
      },
      author: {
        connect: {
          id: authorId,
        },
      },
      ...(data.label_ids &&
        data.label_ids.length > 0 && {
          labels: {
            create: data.label_ids.map((label_id: string) => ({
              label: {
                connect: {
                  id: label_id,
                },
              },
            })),
          },
        }),
    });
  }

  async findOne(feedbackId: string) {
    const feedback = await this.feedbackRepository.findById(feedbackId);

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return feedback;
  }

  async findMany(dto: GetFeedbacksDto) {
    const where = {
      workspace_id: dto.workspace_id,
      ...(dto.label_id && {
        labels: {
          some: {
            label_id: dto.label_id,
          },
        },
      }),
      ...(dto.status && { status: dto.status }),
      ...(dto.search && {
        OR: [
          { title: { contains: dto.search, mode: 'insensitive' } },
          { description: { contains: dto.search, mode: 'insensitive' } },
        ],
      }),
    } satisfies Prisma.FeedbackWhereInput;

    const skip = (dto.page - 1) * dto.limit;
    const orderBy: Prisma.FeedbackOrderByWithRelationInput = {
      created_at: dto.sort_order,
    };

    const result = await this.feedbackRepository.findMany(
      where,
      skip,
      dto.limit,
      orderBy,
    );

    return {
      feedbacks: result.feedbacks,
      total: result.total,
      page: dto.page,
      limit: dto.limit,
      total_pages: Math.ceil(result.total / dto.limit),
    };
  }

  async updateStatus(feedbackId: string, dto: UpdateFeedbackStatusDto) {
    const feedback = await this.feedbackRepository.findById(feedbackId);

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return this.feedbackRepository.updateStatus(feedbackId, dto.status);
  }
}
