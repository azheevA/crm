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

  async create(userId: number, dto: CreateDealDto): Promise<Deal> {
    return this.prisma.$transaction(async (tx) => {
      const deal = await tx.deal.create({
        data: dto,
        include: {
          company: true,
          contact: true,
          owner: true,
        },
      });

      await this.activityService.log(
        {
          type: ActivityType.VALUE_CHANGE,
          content: `Создана новая сделка: "${deal.title}" на сумму ${deal.amount}`,
          userId,
          dealId: deal.id,
          companyId: deal.companyId,
        },
        tx,
      );

      return deal;
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
        activities: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } },
        },
        files: true,
      },
    });
  }
  async update(id: number, userId: number, dto: UpdateDealDto): Promise<Deal> {
    const currentDeal = await this.findOne(id);
    if (!currentDeal) {
      throw new NotFoundException(`Сделка с ID ${id} не найдена`);
    }
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
            userId,
            dealId: updatedDeal.id,
            companyId: updatedDeal.companyId,
          },
          tx,
        );
      }
      if (dto.amount !== undefined && dto.amount !== currentDeal.amount) {
        await this.activityService.log(
          {
            type: ActivityType.VALUE_CHANGE,
            content: `Бюджет изменен: ${currentDeal.amount} -> ${dto.amount}`,
            userId,
            dealId: updatedDeal.id,
            companyId: updatedDeal.companyId,
          },
          tx,
        );
      }

      return updatedDeal;
    });
  }

  async remove(id: number, userId: number): Promise<Deal> {
    const deal = await this.findOne(id);
    if (!deal) {
      throw new NotFoundException(`Сделка с ID ${id} не найдена`);
    }
    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.deal.delete({ where: { id } });

      await this.activityService.log(
        {
          type: ActivityType.VALUE_CHANGE,
          content: `Сделка "${deal.title}" удалена`,
          userId,
          companyId: deal.companyId,
        },
        tx,
      );

      return deleted;
    });
  }
}
