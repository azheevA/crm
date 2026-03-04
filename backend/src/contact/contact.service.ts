import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto } from './company.dto';
import { ActivityType, Contact } from '@prisma/generated';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async create(userId: number, dto: CreateContactDto): Promise<Contact> {
    return this.prisma.$transaction(async (tx) => {
      const contact = await tx.contact.create({
        data: dto,
        include: { company: true },
      });

      await this.activityService.log(
        {
          type: ActivityType.VALUE_CHANGE,
          content: `Добавлен новый контакт: ${contact.firstName} ${contact.lastName}`,
          userId,
          companyId: contact.companyId,
        },
        tx,
      );

      return contact;
    });
  }

  async findAll(): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      include: { company: true, deals: true },
    });
  }

  async findOne(id: number): Promise<Contact | null> {
    return this.prisma.contact.findUnique({
      where: { id },
      include: { company: true, deals: true },
    });
  }
  async update(
    id: number,
    userId: number,
    dto: UpdateContactDto,
  ): Promise<Contact> {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.contact.update({
        where: { id },
        data: dto,
        include: { company: true },
      });

      await this.activityService.log(
        {
          type: ActivityType.VALUE_CHANGE,
          content: `Обновлены данные контакта: ${updated.firstName} ${updated.lastName}`,
          userId,
          companyId: updated.companyId,
        },
        tx,
      );

      return updated;
    });
  }
  async remove(id: number, userId: number): Promise<Contact> {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException(`Контакт с ID ${id} не найден`);

    return await this.prisma.$transaction(async (tx) => {
      const deleted = await tx.contact.delete({
        where: { id },
      });
      await this.activityService.log(
        {
          type: ActivityType.VALUE_CHANGE,
          content: `Удален контакт: ${contact.firstName} ${contact.lastName}`,
          userId,
        },
        tx,
      );

      return deleted;
    });
  }
}
