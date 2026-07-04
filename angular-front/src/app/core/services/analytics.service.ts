import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  resolvedConversations: number;
  totalMessages: number;
  avgMessagesPerConversation: number;
}

export interface DayData {
  date: string;
  count?: number;
  user?: number;
  assistant?: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/analytics`;

  getDashboardStats() {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard`);
  }

  getConversationsByDay(days = 30) {
    return this.http.get<DayData[]>(`${this.baseUrl}/conversations-by-day?days=${days}`);
  }

  getMessagesByDay(days = 30) {
    return this.http.get<DayData[]>(`${this.baseUrl}/messages-by-day?days=${days}`);
  }
}
