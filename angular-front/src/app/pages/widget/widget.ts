import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { WidgetService, type WidgetConfig } from '../../core/services/widget.service';

interface WidgetMessage {
  role: 'visitor' | 'assistant';
  content: string;
}

/** Identifiant anonyme du visiteur, conservé dans son navigateur */
function visitorId(): string {
  const storageKey = 'akwaba.visitor';
  try {
    const existing = localStorage.getItem(storageKey);
    if (existing) return existing;
    const created = crypto.randomUUID().replace(/-/g, '');
    localStorage.setItem(storageKey, created);
    return created;
  } catch {
    // Stockage bloqué (navigation privée, iframe tierce) : identifiant pour la session seulement
    return crypto.randomUUID().replace(/-/g, '');
  }
}

/**
 * Fenêtre de chat publique d'une entreprise (route /widget/:key).
 * Affichée dans une iframe par widget.js sur le site du client, ou ouverte directement.
 */
@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-dvh' },
  template: `
    <div class="flex h-full flex-col bg-white text-slate-800">
      @if (notFound()) {
        <p class="m-auto px-6 text-center text-sm text-slate-500">Ce widget n'existe pas ou n'est plus actif.</p>
      } @else {
        <header class="flex items-center gap-3 px-4 py-3 text-white" [style.background-color]="color()">
          <div class="grid size-9 place-items-center rounded-full bg-white/20 text-sm font-bold">{{ initial() }}</div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">{{ config()?.name ?? '…' }}</p>
            <p class="text-xs text-white/80">Répond en quelques secondes</p>
          </div>
        </header>

        <div #scroller class="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
          @if (config()) {
            <div class="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm shadow-sm">{{ config()!.welcomeMessage }}</div>
          }
          @for (message of messages(); track $index) {
            @if (message.role === 'visitor') {
              <div class="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white" [style.background-color]="color()">{{ message.content }}</div>
            } @else {
              <div class="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm shadow-sm">{{ message.content }}</div>
            }
          }
          @if (sending()) {
            <div class="w-16 rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm text-slate-400 shadow-sm">•••</div>
          }
          @if (error()) {
            <p class="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">{{ error() }}</p>
          }
        </div>

        <form class="flex gap-2 border-t border-slate-200 p-3" (ngSubmit)="send()">
          <input
            name="draft"
            [(ngModel)]="draft"
            maxlength="1000"
            autocomplete="off"
            placeholder="Écrivez votre question…"
            class="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
          />
          <button type="submit" [disabled]="sending() || !draft.trim()" class="rounded-full px-4 text-sm font-semibold text-white disabled:opacity-40" [style.background-color]="color()">
            Envoyer
          </button>
        </form>
        <p class="pb-2 text-center text-[10px] text-slate-400">Propulsé par Akwaba</p>
      }
    </div>
  `,
})
export class WidgetComponent implements OnInit {
  private readonly widgetService = inject(WidgetService);
  private readonly scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');

  /** Clé publique du widget (paramètre de route) */
  readonly key = input.required<string>();

  protected readonly config = signal<WidgetConfig | null>(null);
  protected readonly messages = signal<WidgetMessage[]>([]);
  protected readonly sending = signal(false);
  protected readonly error = signal('');
  protected readonly notFound = signal(false);
  protected draft = '';

  private readonly visitor = visitorId();
  private conversationId?: string;

  protected color(): string {
    return this.config()?.brandColor ?? '#0f766e';
  }

  protected initial(): string {
    return (this.config()?.name ?? 'A').charAt(0).toUpperCase();
  }

  ngOnInit(): void {
    this.widgetService.config(this.key()).subscribe({
      next: (config) => this.config.set(config),
      error: () => this.notFound.set(true),
    });
  }

  protected send(): void {
    const content = this.draft.trim();
    if (!content || this.sending()) return;

    this.draft = '';
    this.error.set('');
    this.messages.update((list) => [...list, { role: 'visitor', content }]);
    this.sending.set(true);
    this.scrollDown();

    this.widgetService
      .send(this.key(), { visitorId: this.visitor, conversationId: this.conversationId, content })
      .subscribe({
        next: ({ conversationId, reply }) => {
          this.conversationId = conversationId;
          this.messages.update((list) => [...list, { role: 'assistant', content: reply }]);
          this.sending.set(false);
          this.scrollDown();
        },
        error: (err: HttpErrorResponse) => {
          this.sending.set(false);
          this.error.set(
            typeof err.error?.message === 'string'
              ? err.error.message
              : 'Le service est momentanément indisponible. Réessayez dans un instant.',
          );
          this.scrollDown();
        },
      });
  }

  private scrollDown(): void {
    setTimeout(() => {
      const el = this.scroller()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
