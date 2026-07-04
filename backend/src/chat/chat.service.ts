import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeepSeekService } from './deepseek.service.js';
import type { SendMessageDto } from './dto/chat.dto.js';
import { DatabaseService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly deepseek: DeepSeekService,
  ) {}

  async sendMessage(userId: string, dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (conversation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        content: dto.content,
        role: 'USER',
        conversationId: dto.conversationId,
      },
    });

    // Fetch conversation history for context
    const history = await this.prisma.message.findMany({
      where: { conversationId: dto.conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const chatMessages = history.map((msg) => ({
      role: msg.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    // Call DeepSeek AI
    const aiResponse = await this.deepseek.chat(chatMessages);

    // Save AI response
    const assistantMessage = await this.prisma.message.create({
      data: {
        content: aiResponse,
        role: 'ASSISTANT',
        conversationId: dto.conversationId,
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { updatedAt: new Date() },
    });

    return { userMessage, assistantMessage };
  }

  async getMessages(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (conversation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
