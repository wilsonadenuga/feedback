import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/client/client';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TokenCreateInput) {
    return this.prisma.token.create({
      data,
    });
  }

  async findByValue(value: string) {
    return this.prisma.token.findUnique({
      where: { value },
    });
  }

  async update(id: string, data: Prisma.TokenUpdateInput) {
    return this.prisma.token.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.token.delete({
      where: { id },
    });
  }
}
