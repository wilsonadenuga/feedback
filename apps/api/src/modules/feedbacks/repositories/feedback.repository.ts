import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/client/browser';

@Injectable()
export class FeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.FeedbackCreateInput) {
    return this.prisma.feedback.create({
      data,
      include: {
        categories: {
          include: {
            category: {
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
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                is_default: true,
              },
            },
          },
        },
        project: true,
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
          categories: {
            include: {
              category: {
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
}
