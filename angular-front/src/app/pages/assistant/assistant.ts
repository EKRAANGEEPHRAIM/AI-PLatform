import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TenantService, type Tenant } from '../../core/services/tenant.service';

/**
 * Réglages de l'assistant de l'entreprise : ce qu'il sait (base de connaissances),
 * comment il oriente vers un humain, son apparence, et le code à coller sur le site.
 */
@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-5xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[var(--text-primary)]">Mon assistant</h1>
        <p class="text-[var(--text-secondary)] mt-1">Ce que l'assistant sait de votre entreprise, et comment l'installer sur votre site.</p>
      </div>

      @if (!tenant()) {
        <p class="text-[var(--text-secondary)]">Chargement…</p>
      } @else {
        <div class="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <form class="space-y-5" (ngSubmit)="save()">
            <section class="rounded-2xl border border-[var(--border-secondary)] bg-[var(--surface-secondary)] p-6">
              <h2 class="text-lg font-semibold text-[var(--text-primary)]">Ce que l'assistant sait</h2>
              <p class="mt-1 text-sm text-[var(--text-secondary)]">
                Collez ici vos informations : produits et prix, horaires, adresse, livraison, paiement, retours.
                L'assistant répond <strong>uniquement</strong> à partir de ce texte et n'invente rien.
              </p>
              <textarea
                name="knowledgeBase"
                rows="14"
                [(ngModel)]="form.knowledgeBase"
                class="mt-4 w-full rounded-xl border border-[var(--border-secondary)] bg-[var(--surface-primary)] p-4 font-mono text-sm leading-6 text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none"
                placeholder="Horaires : du lundi au samedi de 9h à 19h&#10;Livraison à Abidjan : 1 500 FCFA…"
              ></textarea>
              <p class="mt-1 text-right text-xs text-[var(--text-tertiary)]">{{ form.knowledgeBase.length }} / 20 000 caractères</p>
            </section>

            <section class="rounded-2xl border border-[var(--border-secondary)] bg-[var(--surface-secondary)] p-6 space-y-4">
              <h2 class="text-lg font-semibold text-[var(--text-primary)]">Quand il ne sait pas</h2>
              <label class="block">
                <span class="text-sm font-medium text-[var(--text-secondary)]">Comment vous joindre (proposé au client)</span>
                <input
                  name="contactInfo"
                  [(ngModel)]="form.contactInfo"
                  class="mt-1 w-full rounded-xl border border-[var(--border-secondary)] bg-[var(--surface-primary)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none"
                  placeholder="WhatsApp +225 07 … ou en boutique"
                />
              </label>
            </section>

            <section class="rounded-2xl border border-[var(--border-secondary)] bg-[var(--surface-secondary)] p-6 grid gap-4 sm:grid-cols-2">
              <h2 class="sm:col-span-2 text-lg font-semibold text-[var(--text-primary)]">Apparence du widget</h2>
              <label class="block">
                <span class="text-sm font-medium text-[var(--text-secondary)]">Nom affiché</span>
                <input name="name" [(ngModel)]="form.name" required class="mt-1 w-full rounded-xl border border-[var(--border-secondary)] bg-[var(--surface-primary)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none" />
              </label>
              <label class="block">
                <span class="text-sm font-medium text-[var(--text-secondary)]">Couleur</span>
                <div class="mt-1 flex items-center gap-3">
                  <input type="color" name="brandColor" [(ngModel)]="form.brandColor" class="h-10 w-14 cursor-pointer rounded-lg border border-[var(--border-secondary)] bg-transparent" />
                  <span class="font-mono text-sm text-[var(--text-secondary)]">{{ form.brandColor }}</span>
                </div>
              </label>
              <label class="block sm:col-span-2">
                <span class="text-sm font-medium text-[var(--text-secondary)]">Message d'accueil</span>
                <input name="welcomeMessage" [(ngModel)]="form.welcomeMessage" required class="mt-1 w-full rounded-xl border border-[var(--border-secondary)] bg-[var(--surface-primary)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none" />
              </label>
            </section>

            <div class="flex items-center gap-4">
              <button type="submit" [disabled]="saving()" class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition">
                {{ saving() ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
              @if (message()) {
                <span class="text-sm" [class]="messageIsError() ? 'text-[var(--error)]' : 'text-[var(--success)]'">{{ message() }}</span>
              }
            </div>
          </form>

          <aside class="space-y-5">
            <section class="rounded-2xl border border-[var(--border-secondary)] bg-[var(--surface-secondary)] p-6">
              <h2 class="text-lg font-semibold text-[var(--text-primary)]">Installer sur votre site</h2>
              <p class="mt-1 text-sm text-[var(--text-secondary)]">Collez cette ligne juste avant <code>&lt;/body&gt;</code> : la bulle de chat apparaît en bas à droite.</p>
              <pre class="mt-3 overflow-x-auto rounded-xl bg-[var(--surface-primary)] p-3 text-xs leading-5 text-[var(--text-primary)]"><code>{{ snippet() }}</code></pre>
              <button type="button" (click)="copySnippet()" class="mt-3 w-full rounded-xl border border-[var(--border-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--brand-primary-muted)] transition">
                {{ copied() ? 'Copié ✓' : 'Copier le code' }}
              </button>
            </section>

            <section class="rounded-2xl border border-[var(--border-secondary)] bg-[var(--surface-secondary)] p-6">
              <h2 class="text-lg font-semibold text-[var(--text-primary)]">Essayer</h2>
              <p class="mt-1 text-sm text-[var(--text-secondary)]">Posez des questions comme un client, avant de l'installer.</p>
              <div class="mt-3 flex flex-col gap-2">
                <a [href]="'/widget/' + tenant()!.widgetKey" target="_blank" rel="noopener" class="rounded-xl bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition">Ouvrir le widget</a>
                <a routerLink="/chat" class="rounded-xl border border-[var(--border-secondary)] px-4 py-2 text-center text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--brand-primary-muted)] transition">Tester dans l'application</a>
              </div>
            </section>
          </aside>
        </div>
      }
    </div>
  `,
})
export class AssistantComponent implements OnInit {
  private readonly tenantService = inject(TenantService);

  protected readonly tenant = signal<Tenant | null>(null);
  protected readonly saving = signal(false);
  protected readonly message = signal('');
  protected readonly messageIsError = signal(false);
  protected readonly copied = signal(false);

  protected form = { name: '', knowledgeBase: '', contactInfo: '', welcomeMessage: '', brandColor: '#0f766e' };

  protected readonly snippet = computed(() => {
    const key = this.tenant()?.widgetKey ?? '';
    return `<script src="${location.origin}/widget.js" data-akwaba-key="${key}" async></script>`;
  });

  ngOnInit(): void {
    this.tenantService.get().subscribe((tenant) => this.load(tenant));
  }

  private load(tenant: Tenant): void {
    this.tenant.set(tenant);
    this.form = {
      name: tenant.name,
      knowledgeBase: tenant.knowledgeBase,
      contactInfo: tenant.contactInfo,
      welcomeMessage: tenant.welcomeMessage,
      brandColor: tenant.brandColor,
    };
  }

  protected save(): void {
    this.saving.set(true);
    this.message.set('');
    this.tenantService.update(this.form).subscribe({
      next: (tenant) => {
        this.load(tenant);
        this.saving.set(false);
        this.messageIsError.set(false);
        this.message.set("Enregistré : l'assistant utilise déjà ces informations.");
      },
      error: () => {
        this.saving.set(false);
        this.messageIsError.set(true);
        this.message.set("L'enregistrement a échoué. Vérifiez les champs (couleur au format #RRGGBB).");
      },
    });
  }

  protected async copySnippet(): Promise<void> {
    await navigator.clipboard.writeText(this.snippet());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
