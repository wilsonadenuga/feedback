import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/client/client';
import { FeedbackStatus } from '@feedback/schema';

@Injectable()
export class FeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.FeedbackCreateInput) {
    return this.prisma.feedback.create({
      data,
      include: {
        labels: {
          include: {
            label: {
              select: {
                id: true,
                name: true,
                slug: true,
                is_default: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.feedback.findUnique({
      where: { id },
      include: {
        labels: {
          include: {
            label: {
              select: {
                id: true,
                name: true,
                slug: true,
                is_default: true,
              },
            },
          },
        },
        workspace: true,
      },
    });
  }

  async findMany(
    where: Prisma.FeedbackWhereInput,
    skip: number,
    take: number,
    orderBy: Prisma.FeedbackOrderByWithRelationInput,
  ) {
    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          labels: {
            include: {
              label: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  is_default: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return {
      feedbacks,
      total,
    };
  }

  async updateStatus(id: string, status: FeedbackStatus) {
    return this.prisma.feedback.update({
      where: { id },
      data: { status, status_changed_at: new Date() },
      include: {
        labels: {
          include: {
            label: {
              select: {
                id: true,
                name: true,
                slug: true,
                is_default: true,
              },
            },
          },
        },
        workspace: true,
      },
    });
  }
}
