import { Component, signal, inject, input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
      <div class="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 mb-4">
            <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Connexion</h1>
          <p class="text-slate-400 mt-2">Accédez à l'assistant de votre entreprise</p>
        </div>

        @if (error()) {
          <div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">E-mail</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="vous@entreprise.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Mot de passe</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            [disabled]="loading()"
            class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading() ? 'Connexion…' : 'Se connecter' }}
          </button>
        </form>

        <div class="mt-5 rounded-xl border border-indigo-500/25 bg-indigo-500/10 p-4 text-sm">
          <p class="font-semibold text-indigo-200">Vous visitez la démo ?</p>
          <p class="mt-1 text-slate-400">Entrez dans l'espace de Boutique Adjoua : son assistant, sa base de connaissances et les conversations de ses clients.</p>
          <button type="button" class="mt-2 font-semibold text-indigo-400 hover:text-indigo-300" (click)="fillDemo()">Utiliser le compte de démonstration</button>
        </div>

        <p class="mt-6 text-center text-slate-400 text-sm">
          Pas encore de compte ?
          <a routerLink="/register" class="text-indigo-400 hover:text-indigo-300 font-medium">Créer mon assistant</a>
        </p>
      </div>
    </div>
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
