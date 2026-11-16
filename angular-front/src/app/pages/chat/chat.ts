import { Component, computed, inject, input, signal, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConversationsService, type Conversation, type Message } from '../../core/services/conversations.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full">
      <!-- Conversations sidebar -->
      <div class="w-80 border-r border-white/5 flex flex-col bg-slate-800/30">
        <div class="p-4 border-b border-white/5">
          <button
            (click)="createConversation()"
            class="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nouveau test
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          @for (conv of testConversations(); track conv.id) {
            <button
              (click)="selectConversation(conv)"
              [class]="conv.id === selectedConversation()?.id
                ? 'w-full text-left px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 transition'
                : 'w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent transition'"
            >
              <p class="text-white text-sm font-medium truncate">{{ conv.title }}</p>
              <p class="text-slate-500 text-xs mt-1">
                {{ conv._count?.messages || 0 }} messages
              </p>
            </button>
          } @empty {
            <div class="p-4 text-center text-slate-500 text-sm">
              Aucun test pour l'instant. Lancez-en un et posez une question comme le ferait un client.
            </div>
          }
        </div>
      </div>

      <!-- Chat area -->
      <div class="flex-1 flex flex-col">
        @if (selectedConversation()) {
          <!-- Chat header -->
          <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 class="text-white font-semibold">{{ selectedConversation()!.title }}</h2>
              <p class="text-slate-500 text-xs">{{ isVisitorConversation() ? 'Conversation d’un visiteur du site · lecture seule' : 'Test de votre assistant, avec votre base de connaissances' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span
                [class]="selectedConversation()!.status === 'ACTIVE'
                  ? 'px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : selectedConversation()!.status === 'RESOLVED'
                    ? 'px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20'"
              >
                {{ statusLabel(selectedConversation()!.status) }}
              </span>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4" #messagesContainer>
            @for (msg of messages(); track msg.id) {
              <div [class]="msg.role === 'USER' ? 'flex justify-end' : 'flex justify-start'">
                <div
                  [class]="msg.role === 'USER'
                    ? 'max-w-[70%] px-4 py-3 rounded-2xl rounded-br-md bg-indigo-600 text-white'
                    : 'max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10 text-slate-200'"
                >
                  @if (msg.role === 'ASSISTANT') {
                    <div class="flex items-center gap-2 mb-1">
                      <div class="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center">
                        <svg class="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <span class="text-xs text-indigo-400 font-medium">Assistant</span>
                    </div>
                  }
                  <p class="text-sm whitespace-pre-wrap">{{ msg.content }}</p>
                </div>
              </div>
            }

            @if (sending()) {
              <div class="flex justify-start">
                <div class="max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10">
                  <div class="flex items-center gap-2">
                    <div class="flex gap-1">
                      <div class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                      <div class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.1s"></div>
                      <div class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                    <span class="text-slate-400 text-sm">L'assistant rédige sa réponse…</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Input -->
          @if (error()) {
            <p class="mx-4 mb-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{{ error() }}</p>
          }
          @if (!isVisitorConversation()) {
          <div class="p-4 border-t border-white/5">
            <form (ngSubmit)="sendMessage()" class="flex gap-3">
              <input
                type="text"
                [(ngModel)]="messageInput"
                name="message"
                class="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Posez une question comme un client…"
                [disabled]="sending()"
              />
              <button
                type="submit"
                [disabled]="sending() || !messageInput.trim()"
                class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </form>
          </div>
          }
        } @else {
          <!-- Empty state -->
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <div class="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold text-lg">Testez votre assistant</h3>
              <p class="text-slate-400 mt-1">Lancez un test et posez les questions de vos clients : livraison, prix, horaires…</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private readonly conversationsService = inject(ConversationsService);
  private readonly chatService = inject(ChatService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversations = signal<Conversation[]>([]);
  selectedConversation = signal<Conversation | null>(null);
  messages = signal<Message[]>([]);
  messageInput = '';
  sending = signal(false);
  error = signal('');
  private shouldScrollToBottom = false;

  /** ?id=… : conversation ouverte depuis la page Conversations */
  readonly id = input<string>();

  /** La barre latérale ne liste que les tests de l'équipe */
  readonly testConversations = computed(() => this.conversations().filter((c) => c.channel !== 'WIDGET'));
  readonly isVisitorConversation = computed(() => this.selectedConversation()?.channel === 'WIDGET');

  statusLabel(status: Conversation['status']): string {
    return { ACTIVE: 'Active', RESOLVED: 'Résolue', ARCHIVED: 'Archivée' }[status];
  }

  ngOnInit() {
    this.loadConversations();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private loadConversations() {
    this.conversationsService.getAll().subscribe({
      next: (data) => {
        this.conversations.set(data);
        const requested = data.find((c) => c.id === this.id());
        if (requested) this.selectConversation(requested);
      },
    });
  }

  selectConversation(conv: Conversation) {
    this.error.set('');
    this.selectedConversation.set(conv);
    this.chatService.getMessages(conv.id).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.shouldScrollToBottom = true;
      },
    });
  }

  createConversation() {
    const title = `Test du ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    this.conversationsService.create(title).subscribe({
      next: (conv) => {
        this.conversations.update((list) => [conv, ...list]);
        this.selectConversation(conv);
      },
    });
  }

  sendMessage() {
    const content = this.messageInput.trim();
    if (!content || !this.selectedConversation()) return;

    this.messageInput = '';
    this.error.set('');
    this.sending.set(true);

    this.chatService.sendMessage(this.selectedConversation()!.id, content).subscribe({
      next: (res) => {
        this.messages.update((msgs) => [...msgs, res.userMessage, res.assistantMessage]);
        this.sending.set(false);
        this.shouldScrollToBottom = true;
      },
      error: (err: HttpErrorResponse) => {
        this.sending.set(false);
        this.error.set(typeof err.error?.message === 'string' ? err.error.message : 'L’assistant n’a pas pu répondre.');
      },
    });
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
