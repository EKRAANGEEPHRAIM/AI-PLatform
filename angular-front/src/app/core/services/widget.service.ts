import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

export interface WidgetConfig {
  name: string;
  welcomeMessage: string;
  brandColor: string;
}

/** API publique du widget : utilisée sans connexion par les visiteurs des sites clients */
@Injectable({ providedIn: 'root' })
export class WidgetService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/widget`;

  config(key: string) {
    return this.http.get<WidgetConfig>(`${this.baseUrl}/${encodeURIComponent(key)}`);
  }

  send(key: string, payload: { visitorId: string; conversationId?: string; content: string }) {
    return this.http.post<{ conversationId: string; reply: string }>(
      `${this.baseUrl}/${encodeURIComponent(key)}/messages`,
      payload,
    );
  }
}
