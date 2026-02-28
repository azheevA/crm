import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { AccountService } from 'src/account/account.service';
import { Prisma, User } from '@prisma/generated';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private accountService: AccountService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        photo: true,
      },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        photo: true,
      },
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { email } });
  }
  async createUser(name: string, email: string, hash: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: { name, email, hash },
    });
    await this.accountService.create(user.id);
    return user;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return await this.prisma.user.update({
      data,
      where,
      include: {
        photo: true,
      },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.delete({
      where,
    });
  }
}
