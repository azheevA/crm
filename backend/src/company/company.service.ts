import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './company.dto';
import { Company } from '@prisma/generated';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    return await this.prisma.company.create({
      data: dto,
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

  async update(id: number, dto: UpdateCompanyDto): Promise<Company> {
    return await this.prisma.company.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number): Promise<Company> {
    return await this.prisma.company.delete({ where: { id } });
  }
}
