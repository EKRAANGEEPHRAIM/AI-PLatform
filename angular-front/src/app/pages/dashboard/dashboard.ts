import { Component, computed, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService, type DashboardStats } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';
import { ConversationsService, type Conversation } from '../../core/services/conversations.service';
import { whenLabel } from '../../shared/when';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <p class="text-sm font-semibold text-[var(--accent)] first-letter:uppercase">{{ today }}</p>
      <h1 class="mt-1 text-3xl font-extrabold sm:text-4xl">Bonjour {{ firstName() }}.</h1>

      @if (stats(); as s) {
        <p class="mt-3 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">{{ summary() }}</p>

        <!-- Les chiffres, sur une seule ligne réglée -->
        <dl class="mt-8 grid grid-cols-2 gap-px border-y border-[var(--border-secondary)] bg-[var(--border-primary)] sm:grid-cols-4">
          @for (figure of figures(); track figure.label) {
            <div class="bg-[var(--surface-primary)] px-1 py-5 sm:px-5">
              <dt class="text-sm text-[var(--text-secondary)]">{{ figure.label }}</dt>
              <dd class="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums">{{ figure.value }}</dd>
            </div>
          }
        </dl>
      } @else if (statsFailed()) {
        <p class="mt-6 rounded-lg bg-[var(--warning-muted)] px-4 py-3 text-sm text-[var(--warning)]">
          Les chiffres n'ont pas pu être chargés. Le serveur se réveille peut-être : rechargez la page dans une minute.
        </p>
      } @else {
        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          @for (i of [1, 2, 3, 4]; track i) { <div class="skeleton h-20"></div> }
        </div>
      }

      <div class="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
        <!-- Ce que les visiteurs ont demandé -->
        <section>
          <div class="flex items-baseline justify-between gap-4">
            <h2 class="text-xl font-bold">Les dernières questions de vos clients</h2>
            <a routerLink="/conversations" class="shrink-0 text-sm font-semibold text-[var(--brand-primary)] hover:underline">Tout voir</a>
          </div>

          @if (latest(); as list) {
            <ul class="mt-4 divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
              @for (conv of list; track conv.id) {
                <li>
                  <a [routerLink]="['/chat']" [queryParams]="{ id: conv.id }" class="group flex items-start gap-4 py-4 transition hover:bg-[var(--brand-primary-muted)] sm:px-2">
                    <span class="mt-2 size-2 shrink-0 rounded-full" [style.background]="conv.status === 'ACTIVE' ? 'var(--accent)' : 'var(--border-secondary)'"
                      [attr.title]="conv.status === 'ACTIVE' ? 'À relire' : 'Relue'"></span>
                    <span class="min-w-0 flex-1">
                      <span class="block font-medium group-hover:underline">« {{ conv.title }} »</span>
                      <span class="mt-0.5 block text-sm text-[var(--text-tertiary)]">
                        {{ when(conv.createdAt) }} · {{ conv._count?.messages ?? 0 }} messages
                      </span>
                    </span>
                  </a>
                </li>
              } @empty {
                <li class="py-8 text-[var(--text-secondary)]">
                  Aucun visiteur n'a encore écrit. Dès que le widget est sur votre site, leurs questions arrivent ici.
                </li>
              }
            </ul>
          } @else {
            <div class="mt-4 space-y-3">
              @for (i of [1, 2, 3]; track i) { <div class="skeleton h-14"></div> }
            </div>
          }
        </section>

        <!-- Le geste du jour -->
        <aside class="space-y-4">
          <div class="ruled rounded-lg border border-[var(--border-primary)] pb-3 pl-14 pr-5 pt-1">
            <p class="font-[family-name:var(--font-hand)] text-2xl leading-[3.5rem] text-[var(--accent)]">À faire</p>
            <p>Une question est restée sans réponse ? Ajoutez la réponse au cahier : l'assistant la connaîtra tout de suite.</p>
            <a routerLink="/assistant" class="inline-block font-semibold text-[var(--brand-primary)] hover:underline">Ouvrir le cahier →</a>
          </div>
          <a routerLink="/chat" class="card block p-5 transition hover:border-[var(--brand-primary-border)]">
            <p class="font-semibold">Tester avant vos clients</p>
            <p class="mt-1 text-sm leading-6 text-[var(--text-secondary)]">Posez-lui une question comme le ferait un client, et vérifiez sa réponse.</p>
          </a>
        </aside>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly conversationsService = inject(ConversationsService);

  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly statsFailed = signal(false);
  private readonly conversations = signal<Conversation[] | null>(null);

  protected readonly today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  protected readonly firstName = computed(() => (this.authService.currentUser()?.name ?? '').split(' ')[0]);

  protected readonly summary = computed(() => {
    const s = this.stats();
    if (!s) return '';
    if (s.totalConversations === 0) {
      return 'Personne n\'a encore écrit à votre assistant. Remplissez son cahier, testez-le, puis installez-le sur votre site.';
    }
    const total = `${s.totalConversations} conversation${s.totalConversations > 1 ? 's' : ''}`;
    return s.activeConversations > 0
      ? `Votre assistant a tenu ${total}, dont ${s.activeConversations} encore à relire.`
      : `Votre assistant a tenu ${total}, et vous les avez toutes relues.`;
  });

  protected readonly figures = computed(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Conversations', value: s.totalConversations },
      { label: 'À relire', value: s.activeConversations },
      { label: 'Relues', value: s.resolvedConversations },
      { label: 'Messages par conversation', value: s.avgMessagesPerConversation.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) },
    ];
  });

  /** Conversations des visiteurs du site, les plus récentes d'abord */
  protected readonly latest = computed(() => {
    const all = this.conversations();
    if (!all) return null;
    return all
      .filter((c) => c.channel === 'WIDGET' && c.status !== 'ARCHIVED')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6);
  });

  protected when(iso: string): string {
    return whenLabel(iso);
  }

  ngOnInit() {
    this.analyticsService.getDashboardStats().subscribe({
      next: (data) => this.stats.set(data),
      error: () => this.statsFailed.set(true),
    });
    this.conversationsService.getAll().subscribe({
      next: (data) => this.conversations.set(data),
      error: () => this.conversations.set([]),
    });
  }
}
