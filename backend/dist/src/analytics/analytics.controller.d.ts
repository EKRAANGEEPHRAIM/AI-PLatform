import { AnalyticsService } from './analytics.service.js';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(req: any): Promise<{
        totalConversations: number;
        activeConversations: number;
        resolvedConversations: number;
        totalMessages: number;
        avgMessagesPerConversation: number;
    }>;
    getConversationsByDay(req: any, days?: string): Promise<{
        date: string;
        count: number;
    }[]>;
    getMessagesByDay(req: any, days?: string): Promise<{
        user: number;
        assistant: number;
        date: string;
    }[]>;
    getRecentConversations(req: any, limit?: string): Promise<({
        _count: {
            messages: number;
        };
        messages: {
            id: string;
            role: import("@prisma/client").$Enums.MessageRole;
            createdAt: Date;
            content: string;
            conversationId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import("@prisma/client").$Enums.ConversationStatus;
        userId: string;
    })[]>;
    getGlobalStats(): Promise<{
        totalUsers: number;
        totalConversations: number;
        totalMessages: number;
    }>;
}
