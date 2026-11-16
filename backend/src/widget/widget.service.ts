import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../prisma/prisma.service';
import { AssistantService, type ChatMessage } from '../assistant/assistant.service.js';
import { TenantService } from '../tenant/tenant.service.js';
import type { WidgetMessageDto } from './widget.dto.js';

/** Messages de visiteurs par entreprise et par 24 h (protège le quota IA d'une démo publique) */
const TENANT_DAILY_LIMIT = Number(process.env.WIDGET_DAILY_LIMIT ?? 200);
/** Messages par visiteur et par heure (anti-abus) */
const VISITOR_HOURLY_LIMIT = Number(process.env.WIDGET_VISITOR_HOURLY_LIMIT ?? 20);
/** Messages précédents envoyés au modèle pour garder le fil de la conversation */
const HISTORY_SIZE = 12;

const HOUR = 60 * 60 * 1000;

@Injectable()
export class WidgetService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly tenants: TenantService,
    private readonly assistant: AssistantService,
  ) {}

  private async tenantOr404(widgetKey: string) {
    const tenant = await this.tenants.findByWidgetKey(widgetKey);
    if (!tenant) throw new NotFoundException('Widget introuvable');
    return tenant;
  }

  /** Ce que le widget affiche avant le premier message (aucune donnée privée) */
  async publicConfig(widgetKey: string) {
    const tenant = await this.tenantOr404(widgetKey);
    return { name: tenant.name, welcomeMessage: tenant.welcomeMessage, brandColor: tenant.brandColor };
  }

  async sendMessage(widgetKey: string, dto: WidgetMessageDto) {
    const tenant = await this.tenantOr404(widgetKey);
    await this.assertWithinLimits(tenant.id, dto.visitorId);

    let conversationId = dto.conversationId;
    if (conversationId) {
      // Un visiteur ne peut poursuivre que sa propre conversation, sur ce widget
      const existing = await this.prisma.conversation.findFirst({
        where: { id: conversationId, tenantId: tenant.id, visitorId: dto.visitorId, channel: 'WIDGET' },
      });
      if (!existing) conversationId = undefined;
    }
    if (!conversationId) {
      const created = await this.prisma.conversation.create({
        data: {
          title: dto.content.length > 60 ? `${dto.content.slice(0, 57)}…` : dto.content,
          channel: 'WIDGET',
          visitorId: dto.visitorId,
          tenantId: tenant.id,
        },
      });
      conversationId = created.id;
    }

    await this.prisma.message.create({ data: { conversationId, role: 'USER', content: dto.content } });

    const history = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: HISTORY_SIZE,
    });
    const messages: ChatMessage[] = history
      .reverse()
      .map((m) => ({ role: m.role === 'ASSISTANT' ? 'assistant' : 'user', content: m.content }));

    const reply = await this.assistant.reply(tenant, messages);

    await this.prisma.message.create({ data: { conversationId, role: 'ASSISTANT', content: reply } });
    await this.prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

    return { conversationId, reply };
  }

  private async assertWithinLimits(tenantId: string, visitorId: string): Promise<void> {
    const since = (ms: number) => new Date(Date.now() - ms);
    const [tenantCount, visitorCount] = await Promise.all([
      this.prisma.message.count({
        where: { role: 'USER', createdAt: { gte: since(24 * HOUR) }, conversation: { tenantId, channel: 'WIDGET' } },
      }),
      this.prisma.message.count({
        where: { role: 'USER', createdAt: { gte: since(HOUR) }, conversation: { tenantId, visitorId } },
      }),
    ]);

    if (tenantCount >= TENANT_DAILY_LIMIT || visitorCount >= VISITOR_HOURLY_LIMIT) {
      throw new HttpException(
        "L'assistant a reçu beaucoup de messages. Merci de réessayer un peu plus tard ou de contacter directement l'entreprise.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
