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
var DeepSeekService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepSeekService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let DeepSeekService = DeepSeekService_1 = class DeepSeekService {
    configService;
    logger = new common_1.Logger(DeepSeekService_1.name);
    apiKey;
    apiUrl = 'https://api.deepseek.com/v1/chat/completions';
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('DEEPSEEK_API_KEY') ?? '';
    }
    async chat(messages) {
        const systemMessage = {
            role: 'system',
            content: `You are an intelligent AI customer support assistant. You help users with their questions professionally, clearly, and concisely. Always be polite and helpful. If you don't know the answer, say so honestly.`,
        };
        const body = {
            model: 'deepseek-chat',
            messages: [systemMessage, ...messages],
            temperature: 0.7,
            max_tokens: 2048,
        };
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`DeepSeek API error: ${response.status} - ${errorText}`);
                throw new Error(`DeepSeek API error: ${response.status}`);
            }
            const data = (await response.json());
            return data.choices[0]?.message?.content ?? 'No response from AI.';
        }
        catch (error) {
            this.logger.error('DeepSeek API call failed', error);
            throw error;
        }
    }
};
exports.DeepSeekService = DeepSeekService;
exports.DeepSeekService = DeepSeekService = DeepSeekService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DeepSeekService);
//# sourceMappingURL=deepseek.service.js.map