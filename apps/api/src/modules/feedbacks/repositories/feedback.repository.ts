import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateFeedbackDto, GetFeedbacksDto } from '../dto';
import { Prisma } from '../../../../generated/client/browser';

@Injectable()
export class FeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(project_id: string, data: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        title: data.title,
        description: data.description,
        customer_id: data.customer_id,
        customer_email: data.customer_email,
        customer_name: data.customer_name,
        customer_meta: data.customer_meta,
        project: {
          connect: {
            id: project_id,
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
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.feedback.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        project: true,
      },
    });
  }

  async findMany(dto: GetFeedbacksDto) {
    const { project_id, category_id, status, search, page, limit, sort_order } =
      dto;

    const where: Prisma.FeedbackWhereInput = {
      project_id,
      ...(category_id && {
        categories: {
          some: {
            category_id,
          },
        },
      }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { customer_email: { contains: search, mode: 'insensitive' } },
          { customer_name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const skip = (page - 1) * limit;

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: sort_order },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return {
      feedbacks,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async validateUserAccess(feedback_id: string, user_id: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: feedback_id },
      include: {
        project: {
          include: {
            workspace: {
              include: {
                members: {
                  where: {
                    user_id,
                  },
                  select: {
                    id: true,
                    role: true,
                    workspace_id: true,
                    user_id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!feedback) {
      return null;
    }

    const member = feedback.project.workspace.members[0];
    if (!member) {
      return null;
    }

    return { feedback, member };
  }
}
