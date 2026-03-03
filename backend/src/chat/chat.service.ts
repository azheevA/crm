import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from './chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(authorId: number, dto: SendMessageDto) {
    return await this.prisma.message.create({
      data: {
        text: dto.text,
        authorId: authorId,
        files: dto.fileIds
          ? {
              connect: dto.fileIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: {
          include: { avatar: true },
        },
        files: true,
      },
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
