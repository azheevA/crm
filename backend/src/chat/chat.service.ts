import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './chat.dto';
import { ActivityService } from 'src/activity/activity.service';
import { Message, ActivityType, ChatMember, Prisma } from '@prisma/generated';

export type ChatWithDetails = Prisma.ChatGetPayload<{
  include: {
    members: {
      include: { user: { include: { avatar: true } } };
    };
    lastMessage: true;
  };
}>;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async createMessage(userId: number, dto: CreateMessageDto): Promise<Message> {
    const { text, chatId, fileIds, dealId } = dto;

    const isMember: ChatMember | null = await this.prisma.chatMember.findUnique(
      {
        where: { chatId_userId: { chatId, userId } },
      },
    );

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          text,
          chatId,
          authorId: userId,
          files: fileIds?.length
            ? { connect: fileIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          author: { include: { avatar: true } },
          files: true,
        },
      });

      await tx.chat.update({
        where: { id: chatId },
        data: { lastMessageId: message.id },
      });

      if (dealId) {
        await this.activityService.log(
          {
            type: ActivityType.CHAT_MESSAGE,
            content: text,
            userId,
            dealId,
          },
          tx,
        );
      }

      return message;
    });
  }

  async getMessages(
    chatId: number,
    limit: number = 20,
    cursorId?: number,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chatId },
      take: limit,
      skip: cursorId ? 1 : 0,
      cursor: cursorId ? { id: cursorId } : undefined,
      orderBy: { createdAt: 'desc' },
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

  async getUserChats(userId: number): Promise<ChatWithDetails[]> {
    return this.prisma.chat.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: {
          include: { user: { include: { avatar: true } } },
        },
        lastMessage: true,
      },
    });
  }
  async isChatMember(userId: number, chatId: number): Promise<boolean> {
    const member = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId } },
    });
    return !!member;
  }
}
