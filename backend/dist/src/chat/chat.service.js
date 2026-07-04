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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const deepseek_service_js_1 = require("./deepseek.service.js");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    prisma;
    deepseek;
    constructor(prisma, deepseek) {
        this.prisma = prisma;
        this.deepseek = deepseek;
    }
    async sendMessage(userId, dto) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: dto.conversationId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (conversation.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const userMessage = await this.prisma.message.create({
            data: {
                content: dto.content,
                role: 'USER',
                conversationId: dto.conversationId,
            },
        });
        const history = await this.prisma.message.findMany({
            where: { conversationId: dto.conversationId },
            orderBy: { createdAt: 'asc' },
            take: 20,
        });
        const chatMessages = history.map((msg) => ({
            role: msg.role.toLowerCase(),
            content: msg.content,
        }));
        const aiResponse = await this.deepseek.chat(chatMessages);
        const assistantMessage = await this.prisma.message.create({
            data: {
                content: aiResponse,
                role: 'ASSISTANT',
                conversationId: dto.conversationId,
            },
        });
        await this.prisma.conversation.update({
            where: { id: dto.conversationId },
            data: { updatedAt: new Date() },
        });
        return { userMessage, assistantMessage };
    }
    async getMessages(userId, conversationId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (conversation.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.DatabaseService,
        deepseek_service_js_1.DeepSeekService])
], ChatService);
//# sourceMappingURL=chat.service.js.map