"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(userId) {
        const [totalConversations, activeConversations, resolvedConversations, totalMessages] = await Promise.all([
            this.prisma.conversation.count({ where: { userId } }),
            this.prisma.conversation.count({ where: { userId, status: 'ACTIVE' } }),
            this.prisma.conversation.count({ where: { userId, status: 'RESOLVED' } }),
            this.prisma.message.count({
                where: { conversation: { userId } },
            }),
        ]);
        const avgMessagesPerConversation = totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0;
        return {
            totalConversations,
            activeConversations,
            resolvedConversations,
            totalMessages,
            avgMessagesPerConversation,
        };
    }
    async getConversationsByDay(userId, days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const conversations = await this.prisma.conversation.findMany({
            where: { userId, createdAt: { gte: since } },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        const grouped = {};
        for (const conv of conversations) {
            const day = conv.createdAt.toISOString().split('T')[0];
            grouped[day] = (grouped[day] ?? 0) + 1;
        }
        return Object.entries(grouped).map(([date, count]) => ({ date, count }));
    }
    async getMessagesByDay(userId, days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const messages = await this.prisma.message.findMany({
            where: { conversation: { userId }, createdAt: { gte: since } },
            select: { createdAt: true, role: true },
            orderBy: { createdAt: 'asc' },
        });
        const grouped = {};
        for (const msg of messages) {
            const day = msg.createdAt.toISOString().split('T')[0];
            if (!grouped[day])
                grouped[day] = { user: 0, assistant: 0 };
            if (msg.role === 'USER')
                grouped[day].user++;
            else if (msg.role === 'ASSISTANT')
                grouped[day].assistant++;
        }
        return Object.entries(grouped).map(([date, counts]) => ({ date, ...counts }));
    }
    async getRecentConversations(userId, limit = 5) {
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
    async getGlobalStats() {
        const [totalUsers, totalConversations, totalMessages] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.conversation.count(),
            this.prisma.message.count(),
        ]);
        return { totalUsers, totalConversations, totalMessages };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.DatabaseService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map