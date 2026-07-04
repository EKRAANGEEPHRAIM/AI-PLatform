import { ConversationsService } from './conversations.service.js';
import { type CreateConversationDto, type UpdateConversationDto } from './dto/conversation.dto.js';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    create(req: any, dto: CreateConversationDto): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, dto: UpdateConversationDto): Promise<{
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
    remove(req: any, id: string): Promise<{
        deleted: boolean;
    }>;
}
