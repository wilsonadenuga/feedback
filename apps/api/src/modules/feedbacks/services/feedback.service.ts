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

  async create(projectId: string, data: CreateFeedbackDto) {
    return this.feedbackRepository.create({
      title: data.title,
      description: data.description,
      customer_id: data.customer_id,
      customer_email: data.customer_email,
      customer_name: data.customer_name,
      customer_meta: data.customer_meta,
      project: {
        connect: {
          id: projectId,
        },
      },
      ...(data.category_ids &&
        data.category_ids.length > 0 && {
          categories: {
            create: data.category_ids.map((category_id: string) => ({
              category: {
                connect: {
                  id: category_id,
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
      project_id: dto.project_id,
      ...(dto.category_id && {
        categories: {
          some: {
            category_id: dto.category_id,
          },
        },
      }),
      ...(dto.status && { status: dto.status }),
      ...(dto.search && {
        OR: [
          { title: { contains: dto.search, mode: 'insensitive' } },
          { description: { contains: dto.search, mode: 'insensitive' } },
          { customer_email: { contains: dto.search, mode: 'insensitive' } },
          { customer_name: { contains: dto.search, mode: 'insensitive' } },
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
