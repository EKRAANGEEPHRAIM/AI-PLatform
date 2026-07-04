import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

export interface Message {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  createdAt: string;
  conversationId: string;
}

export interface Conversation {
  id: string;
  title: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: Message[];
  _count?: { messages: number };
}

@Injectable({ providedIn: 'root' })
export class ConversationsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/conversations`;

  getAll() {
    return this.http.get<Conversation[]>(this.baseUrl);
  }

  getOne(id: string) {
    return this.http.get<Conversation>(`${this.baseUrl}/${id}`);
  }

  create(title: string) {
    return this.http.post<Conversation>(this.baseUrl, { title });
  }

  update(id: string, data: { title?: string; status?: string }) {
    return this.http.patch<Conversation>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
