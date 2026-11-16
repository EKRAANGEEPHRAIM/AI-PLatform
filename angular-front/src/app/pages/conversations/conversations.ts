import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationsService, type Conversation } from '../../core/services/conversations.service';

@Component({
  selector: 'app-conversations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Conversations</h1>
          <p class="text-slate-400 mt-1">Les questions posées par les visiteurs de votre site, et vos propres tests</p>
        </div>
        <button
          (click)="newTest()"
          class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Tester l'assistant
        </button>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 mb-6">
        @for (filter of filters; track filter.value) {
          <button
            (click)="activeFilter.set(filter.value)"
            [class]="activeFilter() === filter.value
              ? 'px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-sm font-medium'
              : 'px-4 py-2 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 text-sm font-medium transition'"
          >
            {{ filter.label }}
          </button>
        }
      </div>

      <!-- Table -->
      <div class="rounded-2xl border border-white/10 overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-white/5">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Titre</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Origine</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Statut</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Messages</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Créée le</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (conv of filteredConversations(); track conv.id) {
              <tr class="border-t border-white/5 hover:bg-white/[0.02] transition">
                <td class="px-6 py-4">
                  <p class="text-white text-sm font-medium">{{ conv.title }}</p>
                </td>
                <td class="px-6 py-4">
                  @if (conv.channel === 'WIDGET') {
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-300 border border-orange-500/20">Site web</span>
                  } @else {
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/10">Test</span>
                  }
                </td>
                <td class="px-6 py-4">
                  <span
                    [class]="conv.status === 'ACTIVE'
                      ? 'px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : conv.status === 'RESOLVED'
                        ? 'px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        : 'px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20'"
                  >
                    {{ statusLabels[conv.status] }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-400 text-sm">
                  {{ conv._count?.messages || 0 }}
                </td>
                <td class="px-6 py-4 text-slate-400 text-sm">
                  {{ formatDate(conv.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      (click)="openChat(conv)"
                      class="p-2 rounded-lg hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 transition"
                      [title]="conv.channel === 'WIDGET' ? 'Lire la conversation' : 'Ouvrir le test'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    </button>
                    @if (conv.status === 'ACTIVE') {
                      <button
                        (click)="resolve(conv)"
                        class="p-2 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition"
                        title="Marquer comme résolue"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </button>
                    }
                    <button
                      (click)="archive(conv)"
                      class="p-2 rounded-lg hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition"
                      title="Archiver"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                      </svg>
                    </button>
                    <button
                      (click)="deleteConv(conv)"
                      class="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition"
                      title="Supprimer"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                  Aucune conversation. Installez le widget sur votre site ou testez votre assistant.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ConversationsComponent implements OnInit {
  private readonly conversationsService = inject(ConversationsService);
  private readonly router = inject(Router);

  conversations = signal<Conversation[]>([]);
  activeFilter = signal<string>('ALL');

  filters = [
    { label: 'Toutes', value: 'ALL' },
    { label: 'Site web', value: 'WIDGET' },
    { label: 'Actives', value: 'ACTIVE' },
    { label: 'Résolues', value: 'RESOLVED' },
    { label: 'Archivées', value: 'ARCHIVED' },
  ];

  filteredConversations = computed(() => {
    const filter = this.activeFilter();
    const convs = this.conversations();
    if (filter === 'ALL') return convs;
    if (filter === 'WIDGET') return convs.filter((c) => c.channel === 'WIDGET');
    return convs.filter((c) => c.status === filter);
  });

  ngOnInit() {
    this.loadConversations();
  }

  private loadConversations() {
    this.conversationsService.getAll().subscribe({
      next: (data) => this.conversations.set(data),
    });
  }

  readonly statusLabels: Record<Conversation['status'], string> = { ACTIVE: 'Active', RESOLVED: 'Résolue', ARCHIVED: 'Archivée' };

  newTest() {
    this.router.navigate(['/chat']);
  }

  openChat(conv: Conversation) {
    this.router.navigate(['/chat'], { queryParams: { id: conv.id } });
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
