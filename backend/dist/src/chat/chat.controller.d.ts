import { ChatService } from './chat.service.js';
import { type SendMessageDto } from './dto/chat.dto.js';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(req: any, dto: SendMessageDto): Promise<{
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
    getMessages(req: any, conversationId: string): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.MessageRole;
        createdAt: Date;
        content: string;
        conversationId: string;
    }[]>;
}
