import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/client/browser';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(payload: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: payload,
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: Omit<Prisma.UserUpdateInput, 'id'>) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
