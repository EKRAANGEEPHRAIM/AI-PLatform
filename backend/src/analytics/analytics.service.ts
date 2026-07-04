import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/prisma.service';


@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma : DatabaseService) {}

  async getDashboardStats(userId: string) {
    const [totalConversations, activeConversations, resolvedConversations, totalMessages] =
      await Promise.all([
        this.prisma.conversation.count({ where: { userId } }),
        this.prisma.conversation.count({ where: { userId, status: 'ACTIVE' } }),
        this.prisma.conversation.count({ where: { userId, status: 'RESOLVED' } }),
        this.prisma.message.count({
          where: { conversation: { userId } },
        }),
      ]);

    const avgMessagesPerConversation =
      totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0;

    return {
      totalConversations,
      activeConversations,
      resolvedConversations,
      totalMessages,
      avgMessagesPerConversation,
    };
  }

  async getConversationsByDay(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const conversations = await this.prisma.conversation.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const grouped: Record<string, number> = {};
    for (const conv of conversations) {
      const day = conv.createdAt.toISOString().split('T')[0]!;
      grouped[day] = (grouped[day] ?? 0) + 1;
    }

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }

  async getMessagesByDay(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const messages = await this.prisma.message.findMany({
      where: { conversation: { userId }, createdAt: { gte: since } },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: 'asc' },
    });

    const grouped: Record<string, { user: number; assistant: number }> = {};
    for (const msg of messages) {
      const day = msg.createdAt.toISOString().split('T')[0]!;
      if (!grouped[day]) grouped[day] = { user: 0, assistant: 0 };
      if (msg.role === 'USER') grouped[day].user++;
      else if (msg.role === 'ASSISTANT') grouped[day].assistant++;
    }

    return Object.entries(grouped).map(([date, counts]) => ({ date, ...counts }));
  }

  async getRecentConversations(userId: string, limit = 5) {
    return this.prisma.conversation.findMany({
      where: { userId },
      include: {
        _count: { select: { messages: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }

  // Admin-only: global stats
  async getGlobalStats() {
    const [totalUsers, totalConversations, totalMessages] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.conversation.count(),
      this.prisma.message.count(),
    ]);

    return { totalUsers, totalConversations, totalMessages };
  }
}
