import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import type { Message } from './conversations.service';

interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/chat`;

  sendMessage(conversationId: string, content: string) {
    return this.http.post<ChatResponse>(`${this.baseUrl}/send`, { conversationId, content });
  }

  getMessages(conversationId: string) {
    return this.http.get<Message[]>(`${this.baseUrl}/messages/${conversationId}`);
  }
}
