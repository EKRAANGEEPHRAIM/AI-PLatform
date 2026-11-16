import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen bg-[var(--surface-primary)]">
      <!-- Sidebar -->
      <aside class="w-64 bg-[var(--surface-secondary)] border-r border-[var(--border-primary)] flex flex-col">
        <!-- Logo -->
        <div class="p-6 border-b border-white/5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-[var(--text-primary)] font-bold text-lg">Akwaba</h1>
              <p class="text-slate-500 text-xs">Service client IA</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            <span class="font-medium">Tableau de bord</span>
          </a>

          <a
            routerLink="/chat"
            routerLinkActive="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span class="font-medium">Tester l'assistant</span>
          </a>

          <a
            routerLink="/conversations"
            routerLinkActive="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span class="font-medium">Conversations</span>
          </a>

          <a
            routerLink="/assistant"
            routerLinkActive="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            <span class="font-medium">Mon assistant</span>
          </a>
        </nav>

        <!-- Theme toggle -->
        <div class="px-4 py-2">
          <button
            (click)="themeService.toggle()"
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--brand-primary-muted)] transition"
            [attr.aria-label]="themeService.isDark() ? 'Passer en mode clair' : 'Passer en mode sombre'"
          >
            @if (themeService.isDark()) {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <span class="text-sm font-medium">Mode clair</span>
            } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
              <span class="text-sm font-medium">Mode sombre</span>
            }
          </button>
        </div>

        <!-- User section -->
        <div class="p-4 border-t border-[var(--border-primary)]">
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="w-9 h-9 rounded-full bg-[var(--brand-primary-muted)] flex items-center justify-center">
              <span class="text-[var(--brand-primary)] font-semibold text-sm">
                {{ authService.currentUser()?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[var(--text-primary)] text-sm font-medium truncate">{{ authService.currentUser()?.name }}</p>
              <p class="text-[var(--text-tertiary)] text-xs truncate">{{ authService.currentUser()?.email }}</p>
            </div>
            <button
              (click)="authService.logout()"
              class="text-[var(--text-tertiary)] hover:text-[var(--error)] transition"
              title="Déconnexion"
              aria-label="Déconnexion"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class LayoutComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
}
