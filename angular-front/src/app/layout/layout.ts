import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { BrandComponent } from '../shared/brand';

interface NavItem {
  path: string;
  label: string;
  short: string;
  /** Tracés SVG (viewBox 24, trait) */
  icon: string[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-dvh flex-col bg-[var(--surface-primary)] text-[var(--text-primary)] md:flex-row">
      <!-- Barre latérale (tablette et ordinateur) -->
      <aside class="hidden w-60 shrink-0 flex-col border-r border-[var(--border-primary)] md:flex">
        <a routerLink="/" class="px-6 pb-6 pt-6" aria-label="Akwaba, accueil"><app-brand /></a>

        <nav class="flex-1 space-y-0.5 px-3" aria-label="Navigation principale">
          @for (item of nav; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="is-active" #rla="routerLinkActive"
              [attr.aria-current]="rla.isActive ? 'page' : null"
              class="nav-link group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] font-medium text-[var(--text-secondary)] transition hover:bg-[var(--brand-primary-muted)] hover:text-[var(--text-primary)]">
              <svg class="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                @for (d of item.icon; track $index) { <path [attr.d]="d" /> }
              </svg>
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="space-y-1 border-t border-[var(--border-primary)] p-3">
          <button type="button" (click)="themeService.toggle()"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--brand-primary-muted)]">
            <svg class="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
              @if (themeService.isDark()) {
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              } @else {
                <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
              }
            </svg>
            {{ themeService.isDark() ? 'Mode clair' : 'Mode sombre' }}
          </button>

          <div class="flex items-center gap-3 px-3 py-2">
            <div class="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent-muted)] text-sm font-bold text-[var(--accent)]">
              {{ initial() }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ authService.currentUser()?.name }}</p>
              <p class="truncate text-xs text-[var(--text-tertiary)]">{{ authService.currentUser()?.email }}</p>
            </div>
            <button type="button" (click)="authService.logout()" title="Se déconnecter" aria-label="Se déconnecter"
              class="rounded-md p-1.5 text-[var(--text-tertiary)] transition hover:bg-[var(--error-muted)] hover:text-[var(--error)]">
              <svg class="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- En-tête (téléphone) -->
      <header class="flex items-center justify-between border-b border-[var(--border-primary)] px-4 py-3 md:hidden">
        <a routerLink="/" aria-label="Akwaba, accueil"><app-brand [size]="26" /></a>
        <div class="flex items-center gap-1">
          <button type="button" (click)="themeService.toggle()" class="rounded-md p-2 text-[var(--text-secondary)]"
            [attr.aria-label]="themeService.isDark() ? 'Passer en mode clair' : 'Passer en mode sombre'">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
              <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
            </svg>
          </button>
          <button type="button" (click)="authService.logout()" class="rounded-md p-2 text-[var(--text-secondary)]" aria-label="Se déconnecter">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3" />
            </svg>
          </button>
        </div>
      </header>

      <main class="min-h-0 flex-1 overflow-auto">
        <router-outlet />
      </main>

      <!-- Onglets (téléphone) -->
      <nav class="grid grid-cols-4 border-t border-[var(--border-primary)] bg-[var(--surface-secondary)] md:hidden" aria-label="Navigation principale">
        @for (item of nav; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="!text-[var(--brand-primary)]" #rlm="routerLinkActive"
            [attr.aria-current]="rlm.isActive ? 'page' : null"
            class="flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold text-[var(--text-tertiary)]">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              @for (d of item.icon; track $index) { <path [attr.d]="d" /> }
            </svg>
            {{ item.short }}
          </a>
        }
      </nav>
    </div>
  `,
  styles: `
    .nav-link.is-active {
      background: var(--brand-primary-muted);
      color: var(--text-primary);
      font-weight: 600;
    }
    .nav-link.is-active::before {
      content: '';
      position: absolute;
      left: -0.75rem;
      top: 0.55rem;
      bottom: 0.55rem;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: var(--accent);
    }
  `,
})
export class LayoutComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);

  protected readonly nav: NavItem[] = [
    { path: '/dashboard', label: 'Aujourd\'hui', short: 'Accueil', icon: ['M3 11.5 12 4l9 7.5', 'M5 10v10h14V10', 'M10 20v-5h4v5'] },
    { path: '/conversations', label: 'Questions des clients', short: 'Questions', icon: ['M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z', 'M9 10h6M9 14h4'] },
    { path: '/assistant', label: 'Le cahier', short: 'Cahier', icon: ['M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z', 'M5 17a3 3 0 0 1 3-3h11', 'M9 8h6'] },
    { path: '/chat', label: 'Tester l\'assistant', short: 'Tester', icon: ['M4 5h16v11H9l-5 4V5Z', 'M9 10.5h.01M12 10.5h.01M15 10.5h.01'] },
  ];

  protected initial(): string {
    return (this.authService.currentUser()?.name ?? '?').charAt(0).toUpperCase();
  }
}
