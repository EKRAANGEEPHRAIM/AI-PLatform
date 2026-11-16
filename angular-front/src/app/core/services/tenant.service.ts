import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

/** Entreprise de l'utilisateur connecté et réglages de son assistant */
export interface Tenant {
  id: string;
  name: string;
  knowledgeBase: string;
  contactInfo: string;
  welcomeMessage: string;
  brandColor: string;
  widgetKey: string;
}

export type TenantSettings = Pick<Tenant, 'name' | 'knowledgeBase' | 'contactInfo' | 'welcomeMessage' | 'brandColor'>;

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tenant`;

  get() {
    return this.http.get<Tenant>(this.baseUrl);
  }

  update(settings: Partial<TenantSettings>) {
    return this.http.patch<Tenant>(this.baseUrl, settings);
  }
}
