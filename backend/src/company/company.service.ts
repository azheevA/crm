import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './company.dto';
import { ActivityType, Company } from '@prisma/generated';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async create(userId: number, dto: CreateCompanyDto): Promise<Company> {
    return await this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: dto,
      });
      await this.activityService.log(
        {
          type: ActivityType.VALUE_CHANGE,
          content: `Добавлена новая компания: "${company.name}"`,
          userId,
          companyId: company.id,
        },
        tx,
      );

      return company;
    });
  }

  async findAll(limit: number = 10, skip: number = 0) {
    return await this.prisma.company.findMany({
      take: limit,
      skip: skip,
      include: {
        _count: {
          select: { contacts: true, deals: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        deals: true,
        activities: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!company) throw new NotFoundException(`Компания с ID ${id} не найдена`);
    return company;
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateCompanyDto,
  ): Promise<Company | null> {
    const currentCompany = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!currentCompany)
      throw new NotFoundException(`Компания с ID ${id} не найдена`);

    return await this.prisma.$transaction(async (tx) => {
      const updatedCompany = await tx.company.update({
        where: { id },
        data: dto,
      });
      await this.activityService.log(
        {
          type: ActivityType.VALUE_CHANGE,
          content: `Обновлены данные компании: "${updatedCompany.name}"`,
          userId,
          companyId: updatedCompany.id,
        },
        tx,
      );

      return updatedCompany;
    });
  }

  async remove(id: number, userId: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException(`Компания с ID ${id} не найдена`);

    return await this.prisma.$transaction(async (tx) => {
      const deleted = await tx.company.delete({
        where: { id },
      });
      await this.activityService.log(
        {
          type: ActivityType.VALUE_CHANGE,
          content: `Удалена компания: "${company.name}"`,
          userId,
        },
        tx,
      );

      return deleted;
    });
  }
}
