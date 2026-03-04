import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { Task } from '@prisma/generated';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...dto,
        dueDate: new Date(dto.dueDate),
        userId,
      },
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

  async update(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }
  async toggleTaskStatus(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.prisma.task.update({
      where: { id },
      data: {
        isCompleted: !task.isCompleted,
      },
    });
  }
}
