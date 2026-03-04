import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { ActivityType, Task } from '@prisma/generated';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          ...dto,
          dueDate: new Date(dto.dueDate),
          userId,
        },
      });
      await this.activityService.log({
        type: ActivityType.TASK_CREATED,
        content: `Создана задача: ${task.title}`,
        userId,
        dealId: task.dealId || undefined,
      });
      return task;
    });
  }

  async findAll(userId: number, dealId?: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
        dealId: dealId ? dealId : undefined,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateTaskDto,
  ): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Задача не найдена');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data: {
          ...dto,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        },
      });

      await this.activityService.log(
        {
          type: ActivityType.TASK_UPDATED,
          content: `Обновлена задача: "${task.title}"`,
          userId,
          dealId: updated.dealId || undefined,
        },
        tx,
      );

      return updated;
    });
  }

  async toggleTaskStatus(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Задача не найдена');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data: { isCompleted: !task.isCompleted },
      });

      await this.activityService.log(
        {
          type: ActivityType.TASK_UPDATED,
          content: `Задача "${task.title}" отмечена как ${updated.isCompleted ? 'выполненная' : 'невыполненная'}`,
          userId,
          dealId: task.dealId || undefined,
        },
        tx,
      );

      return updated;
    });
  }
  async remove(id: number, userId: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Задача не найдена');

    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.task.delete({ where: { id } });

      await this.activityService.log(
        {
          type: ActivityType.TASK_DELETED,
          content: `Удалена задача: "${task.title}"`,
          userId,
          dealId: task.dealId || undefined,
        },
        tx,
      );

      return deleted;
    });
  }
}
