import { Component, signal, inject, input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AuthShellComponent } from '../../shared/auth-shell';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-shell>
      <h1 class="text-3xl font-extrabold">Bon retour.</h1>
      <p class="mt-2 text-[var(--text-secondary)]">Vos clients vous ont peut-être écrit cette nuit.</p>

      @if (error()) {
        <p role="alert" class="mt-6 rounded-lg border border-[var(--error)]/25 bg-[var(--error-muted)] px-3 py-2.5 text-sm text-[var(--error)]">
          {{ error() }}
        </p>
      }

      <form (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
        <label class="block">
          <span class="mb-1.5 block text-sm font-semibold">E-mail</span>
          <input type="email" [(ngModel)]="email" name="email" autocomplete="email" class="field" placeholder="adjoua@maboutique.ci" required />
        </label>
        <label class="block">
          <span class="mb-1.5 block text-sm font-semibold">Mot de passe</span>
          <input type="password" [(ngModel)]="password" name="password" autocomplete="current-password" class="field" required />
        </label>
        <button type="submit" [disabled]="loading()" class="btn-primary w-full py-3">
          {{ loading() ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <div class="mt-8 border-t border-dashed border-[var(--border-secondary)] pt-6">
        <p class="text-sm font-semibold">Vous visitez la démo ?</p>
        <p class="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Entrez chez Boutique Adjoua : son cahier, son assistant et les questions de ses clients.
        </p>
        <button type="button" class="btn-ghost mt-3 w-full py-2.5 text-sm" [disabled]="loading()" (click)="fillDemo()">
          Entrer avec le compte de démonstration
        </button>
      </div>

      <p class="mt-8 text-sm text-[var(--text-secondary)]">
        Pas encore de compte ?
        <a routerLink="/register" class="font-semibold text-[var(--brand-primary)] underline-offset-4 hover:underline">Créer mon assistant</a>
      </p>
    </app-auth-shell>
  `,
})
export class LoginComponent implements OnInit {
  /** ?demo=1 (liens de la page d'accueil) : connexion directe au compte de démonstration */
  readonly demo = input<string>();

  ngOnInit(): void {
    if (this.demo()) void this.fillDemo();
  }

  /** Compte public créé par le seed du backend (prisma/seed.ts) */
  protected fillDemo() {
    this.email = 'demo@akwaba.app';
    this.password = 'Demo2026!';
    return this.onSubmit();
  }

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async onSubmit() {
    this.loading.set(true);
    this.error.set('');

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e: unknown) {
      this.error.set(e instanceof Error && e.message !== 'Invalid credentials' ? e.message : 'E-mail ou mot de passe incorrect.');
    } finally {
      this.loading.set(false);
    }
  }
}
