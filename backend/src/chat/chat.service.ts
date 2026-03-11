import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddMembersDto,
  AddReactionDto,
  CreateChatDto,
  CreateMessageDto,
  EditMessageDto,
  PinMessageDto,
  ReadMessagesDto,
} from './chat.dto';
import { ActivityService } from 'src/activity/activity.service';
import { Message, ActivityType, ChatMember, Prisma } from '@prisma/generated';
import { ChatGateway } from './chat.gateway';

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
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
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

    if (!text && !fileIds?.length) {
      throw new BadRequestException('Message cannot be empty');
    }
    return this.prisma.$transaction(async (tx) => {
      if (dto.replyToId) {
        const reply = await tx.message.findUnique({
          where: { id: dto.replyToId },
        });

        if (!reply || reply.chatId !== chatId) {
          throw new ForbiddenException('Invalid reply');
        }
      }
      const message = await tx.message.create({
        data: {
          text,
          chatId,
          authorId: userId,
          replyToId: dto.replyToId,
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
            content: text ?? '[file]',
            userId,
            dealId,
          },
          tx,
        );
      }
      await tx.chatMember.updateMany({
        where: {
          chatId,
          userId: { not: userId },
        },
        data: {
          unreadCount: { increment: 1 },
        },
      });

      return message;
    });
  }

  async getMessages(
    chatId: number,
    limit: number = 20,
    cursorId?: number,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chatId, isDeleted: false },
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
  async getMessage(messageId: number) {
    return this.prisma.message.findUnique({
      where: { id: messageId },
      select: { chatId: true },
    });
  }
  async getUserChats(userId: number) {
    return this.prisma.chatMember.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            lastMessage: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });
  }
  async isChatMember(userId: number, chatId: number): Promise<boolean> {
    const member = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId } },
    });
    return !!member;
  }
  async createChat(ownerId: number, dto: CreateChatDto) {
    const members = [...new Set([ownerId, ...dto.memberIds])];

    return this.prisma.$transaction(async (tx) => {
      const chat = await tx.chat.create({
        data: {
          title: dto.title,
          isGroup: members.length > 2,
          members: {
            create: members.map((userId) => ({
              userId,
              role: userId === ownerId ? 'OWNER' : 'MEMBER',
            })),
          },
        },
        include: {
          members: true,
        },
      });

      return chat;
    });
  }
  async markAsRead(userId: number, dto: ReadMessagesDto) {
    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
    });

    if (!message || message.chatId !== dto.chatId) {
      throw new ForbiddenException();
    }
    const member = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId: dto.chatId, userId } },
    });

    if (!member) throw new ForbiddenException();
    await this.prisma.chatMember.update({
      where: {
        chatId_userId: {
          chatId: dto.chatId,
          userId,
        },
      },
      data: {
        lastReadMessageId: dto.messageId,
        unreadCount: 0,
      },
    });
  }
  async addReaction(userId: number, dto: AddReactionDto) {
    return this.prisma.reaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId: dto.messageId,
          userId,
          emoji: dto.emoji,
        },
      },
      update: {},
      create: {
        messageId: dto.messageId,
        userId,
        emoji: dto.emoji,
      },
    });
  }
  async pinMessage(dto: PinMessageDto) {
    return this.prisma.chat.update({
      where: { id: dto.chatId },
      data: {
        pinnedMessages: {
          connect: { id: dto.messageId },
        },
      },
    });
  }
  async editMessage(userId: number, dto: EditMessageDto) {
    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
    });

    if (!message || message.authorId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.message.update({
      where: { id: dto.messageId },
      data: {
        text: dto.text,
        isEdited: true,
      },
    });
  }
  async deleteMessage(userId: number, messageId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.authorId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        text: null,
      },
    });
  }
  async checkAdmin(userId: number, chatId: number) {
    const member = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId } },
    });

    return member?.role === 'OWNER' || member?.role === 'ADMIN';
  }
  async getChatMembers(chatId: number) {
    return this.prisma.chatMember.findMany({
      where: { chatId },
      select: { userId: true },
    });
  }
  async addMembers(chatId: number, dto: AddMembersDto) {
    await this.prisma.chatMember.createMany({
      data: dto.memberIds.map((userId) => ({
        chatId,
        userId,
      })),
    });
    this.notifyUsersAboutChat(chatId, dto.memberIds);
  }
  private notifyUsersAboutChat(chatId: number, userIds: number[]) {
    for (const id of userIds) {
      this.chatGateway.emitChatAdded(id, chatId);
    }
  }
}
