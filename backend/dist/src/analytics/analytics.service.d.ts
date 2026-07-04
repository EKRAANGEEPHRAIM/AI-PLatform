import { DatabaseService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    getDashboardStats(userId: string): Promise<{
        totalConversations: number;
        activeConversations: number;
        resolvedConversations: number;
        totalMessages: number;
        avgMessagesPerConversation: number;
    }>;
    getConversationsByDay(userId: string, days?: number): Promise<{
        date: string;
        count: number;
    }[]>;
    getMessagesByDay(userId: string, days?: number): Promise<{
        user: number;
        assistant: number;
        date: string;
    }[]>;
    getRecentConversations(userId: string, limit?: number): Promise<({
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
