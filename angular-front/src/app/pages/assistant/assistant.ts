import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TenantService, type Tenant } from '../../core/services/tenant.service';

/**
 * Le cahier de l'assistant : ce qu'il sait (base de connaissances), vers qui il oriente
 * quand il ne sait pas, son apparence, et la ligne à coller sur le site.
 */
@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <h1 class="text-3xl font-extrabold">Le cahier</h1>
      <p class="mt-1 max-w-2xl text-[var(--text-secondary)]">
        Tout ce que votre assistant sait vient d'ici. Ce qui n'y est pas, il ne l'invente pas : il renvoie le client vers vous.
      </p>

      @if (!tenant()) {
        <div class="mt-8 space-y-4">
          <div class="skeleton h-80"></div>
          <div class="skeleton h-24"></div>
        </div>
      } @else {
        <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_19rem]">
          <form class="space-y-8" (ngSubmit)="save()">
            <section>
              <div class="flex items-baseline justify-between gap-4">
                <label for="kb" class="font-semibold">Ce que l'assistant sait de {{ form.name || 'votre entreprise' }}</label>
                <span class="shrink-0 font-mono text-xs" [style.color]="form.knowledgeBase.length > 20000 ? 'var(--error)' : 'var(--text-tertiary)'">
                  {{ form.knowledgeBase.length.toLocaleString('fr-FR') }} / 20 000
                </span>
              </div>
              <p class="mt-1 text-sm text-[var(--text-secondary)]">Produits et prix, horaires, adresse, quartiers livrés, paiement, retours. En phrases simples.</p>
              <textarea id="kb" name="knowledgeBase" rows="16" [(ngModel)]="form.knowledgeBase"
                class="ruled mt-3 w-full resize-y rounded-lg border border-[var(--border-secondary)] pb-2 pl-14 pr-4 pt-7 text-[0.95rem] text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none"
                placeholder="Ouvert du lundi au samedi, de 8 h à 20 h.&#10;Livraison à Cocody : 1 000 FCFA.&#10;Paiement : Wave, Orange Money, espèces."></textarea>
            </section>

            <section>
              <label for="contact" class="font-semibold">Quand il ne sait pas, il propose de vous joindre…</label>
              <input id="contact" name="contactInfo" [(ngModel)]="form.contactInfo" class="field mt-2" placeholder="sur WhatsApp au +225 07 …, ou en boutique" />
            </section>

            <section class="grid gap-5 border-t border-[var(--border-primary)] pt-8 sm:grid-cols-2">
              <h2 class="text-lg font-bold sm:col-span-2">Ce que voient vos clients</h2>
              <label class="block">
                <span class="mb-1.5 block text-sm font-semibold">Nom affiché</span>
                <input name="name" [(ngModel)]="form.name" required class="field" />
              </label>
              <label class="block">
                <span class="mb-1.5 block text-sm font-semibold">Couleur de la bulle</span>
                <span class="flex items-center gap-3">
                  <input type="color" name="brandColor" [(ngModel)]="form.brandColor" class="h-11 w-14 cursor-pointer rounded-lg border border-[var(--border-secondary)] bg-transparent p-1" />
                  <span class="font-mono text-sm text-[var(--text-secondary)]">{{ form.brandColor }}</span>
                </span>
              </label>
              <label class="block sm:col-span-2">
                <span class="mb-1.5 block text-sm font-semibold">Premier message</span>
                <input name="welcomeMessage" [(ngModel)]="form.welcomeMessage" required class="field" />
              </label>

              <!-- Aperçu en direct de la bulle -->
              <div class="sm:col-span-2">
                <p class="mb-2 text-sm text-[var(--text-tertiary)]">Aperçu</p>
                <div class="max-w-xs overflow-hidden rounded-xl border border-[var(--border-primary)] bg-white text-[#1c2620]">
                  <div class="flex items-center gap-2.5 px-3 py-2.5 text-white" [style.background-color]="form.brandColor">
                    <span class="grid size-7 place-items-center rounded-full bg-white/25 text-xs font-bold">{{ (form.name || 'A').charAt(0).toUpperCase() }}</span>
                    <span class="truncate text-sm font-semibold">{{ form.name }}</span>
                  </div>
                  <p class="m-3 rounded-2xl rounded-tl-sm bg-[#f4f1ea] px-3 py-2 text-sm">{{ form.welcomeMessage }}</p>
                </div>
              </div>
            </section>

            <div class="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-4 border-t border-[var(--border-primary)] bg-[var(--surface-primary)]/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
              <button type="submit" [disabled]="saving() || form.knowledgeBase.length > 20000" class="btn-primary px-5 py-2.5">
                {{ saving() ? 'Enregistrement…' : 'Enregistrer le cahier' }}
              </button>
              @if (message()) {
                <span role="status" class="text-sm" [style.color]="messageIsError() ? 'var(--error)' : 'var(--success)'">{{ message() }}</span>
              }
            </div>
          </form>

          <aside class="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section class="card p-5">
              <h2 class="font-bold">Le mettre sur votre site</h2>
              <p class="mt-1 text-sm leading-6 text-[var(--text-secondary)]">Collez cette ligne juste avant <code class="font-mono text-xs">&lt;/body&gt;</code>. La bulle apparaît en bas à droite.</p>
              <pre class="mt-3 overflow-x-auto rounded-lg bg-[#1c2620] p-3 font-mono text-[0.7rem] leading-5 text-[#e6e0d2]"><code>{{ snippet() }}</code></pre>
              <button type="button" (click)="copySnippet()" class="btn-ghost mt-3 w-full py-2 text-sm">
                {{ copied() ? 'Copié' : 'Copier la ligne' }}
              </button>
            </section>

            <section class="px-1">
              <h2 class="font-bold">Avant de l'installer</h2>
              <p class="mt-1 text-sm leading-6 text-[var(--text-secondary)]">Posez-lui vos questions les plus fréquentes.</p>
              <div class="mt-3 flex flex-col gap-2 text-sm font-semibold">
                <a routerLink="/chat" class="text-[var(--brand-primary)] hover:underline">Tester dans l'application →</a>
                <a [href]="'/widget/' + tenant()!.widgetKey" target="_blank" rel="noopener" class="text-[var(--brand-primary)] hover:underline">Ouvrir la bulle comme un client ↗</a>
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

  protected form = { name: '', knowledgeBase: '', contactInfo: '', welcomeMessage: '', brandColor: '#1f5135' };

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
        this.message.set('Enregistré. L\'assistant répond déjà avec ces informations.');
      },
      error: () => {
        this.saving.set(false);
        this.messageIsError.set(true);
        this.message.set('L\'enregistrement a échoué. Vérifiez les champs (couleur au format #RRGGBB).');
      },
    });
  }

  protected async copySnippet(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.snippet());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.messageIsError.set(true);
      this.message.set('La copie automatique est bloquée : sélectionnez la ligne et copiez-la à la main.');
    }
  }
}
