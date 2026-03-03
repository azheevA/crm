import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/generated';
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
  async getMessage(): Promise<Message[]> {
    return await this.prisma.message.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: {
              select: { url: true },
            },
          },
        },
        files: true,
      },
    });
  }
}
