import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
      <div class="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 mb-4">
            <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Créer mon assistant</h1>
          <p class="text-slate-400 mt-2">Votre assistant de service client prêt en 10 minutes</p>
        </div>

        @if (error()) {
          <div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Nom de l'entreprise</label>
            <input
              type="text"
              [(ngModel)]="companyName"
              name="companyName"
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Ex. : Boutique Adjoua"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Votre nom</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Prénom et nom"
              required
            />
          </div>

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
              placeholder="6 caractères minimum"
              required
            />
          </div>

          <button
            type="submit"
            [disabled]="loading()"
            class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading() ? 'Création…' : 'Créer mon compte' }}
          </button>
        </form>

        <p class="mt-6 text-center text-slate-400 text-sm">
          Déjà un compte ?
          <a routerLink="/login" class="text-indigo-400 hover:text-indigo-300 font-medium">Se connecter</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  companyName = '';
  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async onSubmit() {
    this.loading.set(true);
    this.error.set('');

    try {
      await this.authService.register(this.email, this.password, this.name, this.companyName);
      // Première étape d'un nouveau compte : renseigner ce que l'assistant doit savoir
      this.router.navigate(['/assistant']);
    } catch (e: unknown) {
      this.error.set(
        e instanceof Error && e.message === 'Email already exists'
          ? 'Un compte existe déjà avec cet e-mail.'
          : e instanceof Error ? e.message : "L'inscription a échoué",
      );
    } finally {
      this.loading.set(false);
    }
  }
}
