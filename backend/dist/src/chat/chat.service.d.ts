import { DeepSeekService } from './deepseek.service.js';
import type { SendMessageDto } from './dto/chat.dto.js';
import { DatabaseService } from '../prisma/prisma.service';
export declare class ChatService {
    private readonly prisma;
    private readonly deepseek;
    constructor(prisma: DatabaseService, deepseek: DeepSeekService);
    sendMessage(userId: string, dto: SendMessageDto): Promise<{
        userMessage: {
            id: string;
            role: import("@prisma/client").$Enums.MessageRole;
            createdAt: Date;
            content: string;
            conversationId: string;
        };
        assistantMessage: {
            id: string;
            role: import("@prisma/client").$Enums.MessageRole;
            createdAt: Date;
            content: string;
            conversationId: string;
        };
    }>;
    getMessages(userId: string, conversationId: string): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.MessageRole;
        createdAt: Date;
        content: string;
        conversationId: string;
    }[]>;
}
