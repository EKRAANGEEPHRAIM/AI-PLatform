import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConversationsService, type Conversation } from '../../core/services/conversations.service';
import { whenLabel } from '../../shared/when';

type Filter = 'ALL' | 'WIDGET' | 'ACTIVE' | 'RESOLVED' | 'ARCHIVED';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold">Questions des clients</h1>
          <p class="mt-1 text-[var(--text-secondary)]">Tout ce qu'on a demandé à votre assistant, sur votre site et pendant vos tests.</p>
        </div>
        <a routerLink="/chat" class="btn-primary px-4 py-2.5 text-sm">Tester l'assistant</a>
      </div>

      <div class="mt-8 flex gap-1 overflow-x-auto border-b [scrollbar-width:none] border-[var(--border-primary)]" role="tablist" aria-label="Filtrer les conversations">
        @for (filter of filters; track filter.value) {
          <button type="button" role="tab" [attr.aria-selected]="activeFilter() === filter.value" (click)="activeFilter.set(filter.value)"
            class="-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition"
            [class]="activeFilter() === filter.value
              ? 'border-[var(--accent)] text-[var(--text-primary)]'
              : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
            {{ filter.label }}
            <span class="ml-1 font-mono text-xs font-normal text-[var(--text-tertiary)]">{{ countFor(filter.value) }}</span>
          </button>
        }
      </div>

      <ul class="divide-y divide-[var(--border-primary)]">
        @for (conv of filteredConversations(); track conv.id) {
          <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <a [routerLink]="['/chat']" [queryParams]="{ id: conv.id }" class="group min-w-0 flex-1">
              <span class="block truncate font-medium group-hover:underline">
                {{ conv.channel === 'WIDGET' ? '« ' + conv.title + ' »' : conv.title }}
              </span>
              <span class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-tertiary)]">
                @if (conv.channel === 'WIDGET') {
                  <span class="pill bg-[var(--accent-muted)] text-[var(--accent)]">Visiteur du site</span>
                } @else {
                  <span class="pill bg-[var(--surface-tertiary)] text-[var(--text-secondary)]">Votre test</span>
                }
                <span>{{ when(conv.createdAt) }}</span>
                <span>{{ conv._count?.messages ?? 0 }} messages</span>
                <span [style.color]="conv.status === 'ACTIVE' ? 'var(--accent)' : null">{{ statusLabels[conv.status] }}</span>
              </span>
            </a>

            <div class="flex shrink-0 items-center gap-1">
              @if (conv.status === 'ACTIVE') {
                <button type="button" (click)="resolve(conv)" class="rounded-md px-2.5 py-1.5 text-sm font-semibold text-[var(--brand-primary)] hover:bg-[var(--brand-primary-muted)]">
                  Marquer relue
                </button>
              }
              @if (conv.status !== 'ARCHIVED') {
                <button type="button" (click)="archive(conv)" class="rounded-md px-2.5 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)]">
                  Archiver
                </button>
              }
              <button type="button" (click)="deleteConv(conv)" [attr.aria-label]="'Supprimer la conversation ' + conv.title"
                class="rounded-md p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--error-muted)] hover:text-[var(--error)]" title="Supprimer">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                </svg>
              </button>
            </div>
          </li>
        } @empty {
          <li class="py-14 text-center text-[var(--text-secondary)]">
            @if (loaded()) {
              Rien ici pour l'instant. Installez le widget sur votre site, ou testez votre assistant.
            } @else {
              Chargement…
            }
          </li>
        }
      </ul>
    </div>
  `,
})
export class ConversationsComponent implements OnInit {
  private readonly conversationsService = inject(ConversationsService);

  protected readonly conversations = signal<Conversation[]>([]);
  protected readonly loaded = signal(false);
  protected readonly activeFilter = signal<Filter>('ALL');

  protected readonly filters: { label: string; value: Filter }[] = [
    { label: 'Toutes', value: 'ALL' },
    { label: 'Du site', value: 'WIDGET' },
    { label: 'À relire', value: 'ACTIVE' },
    { label: 'Relues', value: 'RESOLVED' },
    { label: 'Archivées', value: 'ARCHIVED' },
  ];

  protected readonly statusLabels: Record<Conversation['status'], string> = { ACTIVE: 'À relire', RESOLVED: 'Relue', ARCHIVED: 'Archivée' };

  protected readonly filteredConversations = computed(() => this.applyFilter(this.activeFilter()));

  private applyFilter(filter: Filter): Conversation[] {
    const convs = this.conversations();
    if (filter === 'ALL') return convs;
    if (filter === 'WIDGET') return convs.filter((c) => c.channel === 'WIDGET');
    return convs.filter((c) => c.status === filter);
  }

  protected countFor(filter: Filter): number {
    return this.applyFilter(filter).length;
  }

  protected when(iso: string): string {
    return whenLabel(iso);
  }

  ngOnInit() {
    this.loadConversations();
  }

  private loadConversations() {
    this.conversationsService.getAll().subscribe({
      next: (data) => {
        this.conversations.set([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        this.loaded.set(true);
      },
      error: () => this.loaded.set(true),
    });
  }

  resolve(conv: Conversation) {
    this.conversationsService.update(conv.id, { status: 'RESOLVED' }).subscribe({
      next: () => this.loadConversations(),
    });
  }

  archive(conv: Conversation) {
    this.conversationsService.update(conv.id, { status: 'ARCHIVED' }).subscribe({
      next: () => this.loadConversations(),
    });
  }

  deleteConv(conv: Conversation) {
    if (confirm('Supprimer définitivement cette conversation ?')) {
      this.conversationsService.delete(conv.id).subscribe({
        next: () => this.loadConversations(),
      });
    }
  }
}
