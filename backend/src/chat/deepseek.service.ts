import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekChoice {
  message: { role: string; content: string };
}

interface DeepSeekResponse {
  choices: DeepSeekChoice[];
}

@Injectable()
export class DeepSeekService {
  private readonly logger = new Logger(DeepSeekService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DEEPSEEK_API_KEY') ?? '';
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const systemMessage: ChatMessage = {
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

      const data = (await response.json()) as DeepSeekResponse;
      return data.choices[0]?.message?.content ?? 'No response from AI.';
    } catch (error) {
      this.logger.error('DeepSeek API call failed', error);
      throw error;
    }
  }
}
