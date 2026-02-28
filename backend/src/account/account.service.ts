import { Injectable } from '@nestjs/common';
import { PatchAccountDto } from './account.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account } from 'generated/prisma/browser';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number): Promise<Account> {
    return await this.prisma.account.create({
      data: {
        ownerId: userId,
      },
    });
  }
  async getAccount(userId: number): Promise<Account> {
    return await this.prisma.account.findUniqueOrThrow({
      where: { ownerId: userId },
    });
  }

  async patchAccount(userId: number, patch: PatchAccountDto): Promise<Account> {
    return await this.prisma.account.update({
      where: { ownerId: userId },
      data: { ...patch },
    });
  }
}
