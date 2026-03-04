import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityType, Prisma } from '@prisma/generated';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}
  async log(
    data: {
      type: ActivityType;
      content: string;
      userId: number;
      companyId?: number;
      dealId?: number;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;

    return client.activity.create({
      data,
    });
  }
  async findAll(query: {
    dealId?: number;
    companyId?: number;
    limit?: number;
  }) {
    return this.prisma.activity.findMany({
      where: {
        dealId: query.dealId || undefined,
        companyId: query.companyId || undefined,
      },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit || 50,
    });
  }
}
