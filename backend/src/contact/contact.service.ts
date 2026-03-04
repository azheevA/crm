import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto } from './company.dto';
import { Contact } from '@prisma/generated';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    return this.prisma.contact.create({
      data: dto,
      include: { company: true },
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
  async update(id: number, dto: UpdateContactDto): Promise<Contact> {
    return this.prisma.contact.update({
      where: { id },
      data: dto,
      include: {
        company: true,
      },
    });
  }
  async remove(id: number): Promise<Contact> {
    try {
      return await this.prisma.contact.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Контакт с id: ${id} не может быть удален т.к. не существует`,
        );
      }
      throw error;
    }
  }
}
