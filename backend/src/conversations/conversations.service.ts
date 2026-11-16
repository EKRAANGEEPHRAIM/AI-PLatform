import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../prisma/prisma.service';
import type { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto.js';
import { visibleConversations } from './conversation-scope.js';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(userId: string, dto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        title: dto.title,
        userId,
      },
      include: { messages: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.conversation.findMany({
      where: await visibleConversations(this.prisma, userId),
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    await this.assertAccess(userId, conversation);

    return conversation;
  }

  async update(userId: string, conversationId: string, dto: UpdateConversationDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    await this.assertAccess(userId, conversation);

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: dto,
      include: { messages: true },
    });
  }

  async remove(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    await this.assertAccess(userId, conversation);

    await this.prisma.conversation.delete({ where: { id: conversationId } });
    return { deleted: true };
  }

  /** Ses propres conversations, ou celles des visiteurs du widget de son entreprise */
  private async assertAccess(userId: string, conversation: { userId: string | null; tenantId: string | null; channel: string }) {
    if (conversation.userId === userId) return;
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { tenantId: true } });
    if (conversation.channel === 'WIDGET' && user?.tenantId && conversation.tenantId === user.tenantId) return;
    throw new ForbiddenException('Access denied');
  }
}
