import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './chat.dto';
import { ActivityService } from 'src/activity/activity.service';
import { Message, ActivityType } from '@prisma/generated';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async createMessage(userId: number, dto: CreateMessageDto): Promise<Message> {
    const { text, fileIds, dealId } = dto;

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          text,
          authorId: userId,
          files: fileIds?.length
            ? {
                connect: fileIds.map((id: number) => ({ id })),
              }
            : undefined,
        },
        include: { files: true, author: true },
      });
      if (dealId) {
        await this.activityService.log(
          {
            type: ActivityType.CHAT_MESSAGE,
            content: text,
            userId,
            dealId: dealId,
          },
          tx,
        );
      }

      return message;
    });
  }
  async getMessages(limit: number = 20, cursorId?: number): Promise<Message[]> {
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
