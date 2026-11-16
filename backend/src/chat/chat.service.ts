import { Injectable, NotFoundException, ForbiddenException, ServiceUnavailableException } from '@nestjs/common';
import type { SendMessageDto } from './dto/chat.dto.js';
import { DatabaseService } from '../prisma/prisma.service';
import { AssistantService } from '../assistant/assistant.service.js';
import { TenantService } from '../tenant/tenant.service.js';

/** Chat interne : l'équipe teste l'assistant de son entreprise avant de l'installer sur son site */
@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly assistant: AssistantService,
    private readonly tenants: TenantService,
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
    // Vérifié avant d'enregistrer le message, pour ne pas laisser de question sans réponse
    if (!this.assistant.isConfigured) {
      throw new ServiceUnavailableException("L'assistant n'est pas configuré sur ce serveur (AI_API_KEY manquante).");
    }
    const tenant = await this.tenants.forUser(userId);

    // Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        content: dto.content,
        role: 'USER',
        conversationId: dto.conversationId,
      },
    });

    // Les 20 derniers messages (et non les 20 premiers) pour garder le fil
    const history = await this.prisma.message.findMany({
      where: { conversationId: dto.conversationId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const chatMessages = history.reverse().map((msg) => ({
      role: msg.role === 'ASSISTANT' ? ('assistant' as const) : ('user' as const),
      content: msg.content,
    }));

    // Même assistant que sur le widget : il répond avec la base de connaissances de l'entreprise
    const aiResponse = await this.assistant.reply(tenant, chatMessages);

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
    // Lecture : ses propres tests, ou les conversations des visiteurs du widget de son entreprise
    const isOwnTest = conversation.userId === userId;
    const isOwnWidget =
      conversation.channel === 'WIDGET' && conversation.tenantId === (await this.tenants.forUser(userId)).id;
    if (!isOwnTest && !isOwnWidget) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
