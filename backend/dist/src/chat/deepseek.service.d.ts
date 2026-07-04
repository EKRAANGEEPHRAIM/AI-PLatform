import { ConfigService } from '@nestjs/config';
interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export declare class DeepSeekService {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(configService: ConfigService);
    chat(messages: ChatMessage[]): Promise<string>;
}
export {};
