import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealDto, UpdateDealDto } from './deal.dto';
import { ActivityType, Deal } from '@prisma/generated';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class DealService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async create(dto: CreateDealDto): Promise<Deal> {
    return this.prisma.deal.create({
      data: dto,
      include: {
        company: true,
        contact: true,
        owner: true,
      },
    });
  }

  async findAll(): Promise<Deal[]> {
    return this.prisma.deal.findMany({
      include: {
        company: { select: { name: true } },
        contact: { select: { firstName: true, lastName: true } },
        owner: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Deal | null> {
    return this.prisma.deal.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
        owner: true,
        activities: true,
        files: true,
      },
    });
  }
  async update(id: number, dto: UpdateDealDto): Promise<Deal> {
    const currentDeal = await this.prisma.deal.findUnique({ where: { id } });
    if (!currentDeal) throw new NotFoundException();

    return this.prisma.$transaction(async (tx) => {
      const updatedDeal = await tx.deal.update({
        where: { id },
        data: dto,
      });
      if (dto.status && dto.status !== currentDeal.status) {
        await this.activityService.log(
          {
            type: ActivityType.STAGE_CHANGE,
            content: `Статус изменен: ${currentDeal.status} -> ${dto.status}`,
            userId: updatedDeal.ownerId,
            dealId: updatedDeal.id,
            companyId: updatedDeal.companyId,
          },
          tx,
        );
      }

      return updatedDeal;
    });
  }

  async remove(id: number): Promise<Deal> {
    return this.prisma.deal.delete({ where: { id } });
  }
}
