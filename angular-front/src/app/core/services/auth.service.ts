import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environment';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser.set(JSON.parse(userData));
    }
  }

  async login(email: string, password: string): Promise<void> {
    const res = await fetch(`${environment.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: AuthResponse = await res.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }

  async register(email: string, password: string, name: string, companyName?: string): Promise<void> {
    const res = await fetch(`${environment.apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, companyName: companyName?.trim() || undefined }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await res.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
