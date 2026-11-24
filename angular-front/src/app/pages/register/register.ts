import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AuthShellComponent } from '../../shared/auth-shell';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-shell>
      <h1 class="text-3xl font-extrabold">Ouvrez le cahier de votre assistant.</h1>
      <p class="mt-2 text-[var(--text-secondary)]">Deux minutes pour le compte. Ensuite, vous lui écrivez ce qu'il doit savoir.</p>

      @if (error()) {
        <p role="alert" class="mt-6 rounded-lg border border-[var(--error)]/25 bg-[var(--error-muted)] px-3 py-2.5 text-sm text-[var(--error)]">
          {{ error() }}
        </p>
      }

      <form (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
        <label class="block">
          <span class="mb-1.5 block text-sm font-semibold">Nom de votre entreprise</span>
          <input type="text" [(ngModel)]="companyName" name="companyName" autocomplete="organization" class="field" placeholder="Maquis Chez Tantie Rose" required />
        </label>
        <label class="block">
          <span class="mb-1.5 block text-sm font-semibold">Votre nom</span>
          <input type="text" [(ngModel)]="name" name="name" autocomplete="name" class="field" placeholder="Prénom et nom" required />
        </label>
        <label class="block">
          <span class="mb-1.5 block text-sm font-semibold">E-mail</span>
          <input type="email" [(ngModel)]="email" name="email" autocomplete="email" class="field" placeholder="vous@entreprise.ci" required />
        </label>
        <label class="block">
          <span class="mb-1.5 block text-sm font-semibold">Mot de passe</span>
          <input type="password" [(ngModel)]="password" name="password" autocomplete="new-password" class="field" required />
          <span class="mt-1.5 block text-xs text-[var(--text-tertiary)]">6 caractères minimum.</span>
        </label>
        <button type="submit" [disabled]="loading()" class="btn-primary w-full py-3">
          {{ loading() ? 'Création…' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="mt-8 text-sm text-[var(--text-secondary)]">
        Déjà un compte ?
        <a routerLink="/login" class="font-semibold text-[var(--brand-primary)] underline-offset-4 hover:underline">Se connecter</a>
      </p>
    </app-auth-shell>
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
