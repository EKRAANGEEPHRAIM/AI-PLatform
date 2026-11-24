import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(this.getInitialTheme());

  theme = this._theme.asReadonly();
  isDark = computed(() => this._theme() === 'dark');

  constructor() {
    effect(() => {
      const t = this._theme();
      const html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add(t);
      try {
        localStorage.setItem('theme', t);
      } catch {
        // Stockage bloqué : le choix vaut pour cette visite seulement
      }
    });
  }

  toggle() {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  // Clair par défaut (le « papier » est l'identité d'Akwaba) ; le sombre est un choix explicite
  private getInitialTheme(): Theme {
    try {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }
}
