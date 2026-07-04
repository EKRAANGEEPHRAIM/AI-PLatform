import { DatabaseService } from '../prisma/prisma.service';
import type { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto.js';
export declare class ConversationsService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    create(userId: string, dto: CreateConversationDto): Promise<{
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
    }>;
    findAll(userId: string): Promise<({
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
    findOne(userId: string, conversationId: string): Promise<{
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
    }>;
    update(userId: string, conversationId: string, dto: UpdateConversationDto): Promise<{
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
    }>;
    remove(userId: string, conversationId: string): Promise<{
        deleted: boolean;
    }>;
}
