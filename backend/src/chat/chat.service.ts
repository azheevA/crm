import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(userId: number, dto: CreateMessageDto) {
    const { text, fileIds } = dto;
    return this.prisma.message.create({
      data: {
        text,
        authorId: userId,
        files: fileIds?.length
          ? {
              connect: fileIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { files: true, author: true },
    });
  }
  async getMessages(limit: number = 20, cursorId?: number) {
    return await this.prisma.message.findMany({
      take: limit,
      skip: cursorId ? 1 : 0,
      cursor: cursorId ? { id: cursorId } : undefined,
      orderBy: {
        id: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: { select: { url: true } },
          },
        },
        files: true,
      },
    });
  }
}
