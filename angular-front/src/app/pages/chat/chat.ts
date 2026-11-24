import { Component, computed, inject, input, signal, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConversationsService, type Conversation, type Message } from '../../core/services/conversations.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <div class="flex h-full">
      <!-- Liste des tests (cachée sur téléphone quand une conversation est ouverte) -->
      <div class="w-full flex-col border-r border-[var(--border-primary)] md:flex md:w-72"
        [class.hidden]="!!selectedConversation()" [class.flex]="!selectedConversation()">
        <div class="border-b border-[var(--border-primary)] p-4">
          <h1 class="text-xl font-extrabold">Tester l'assistant</h1>
          <p class="mt-1 text-sm leading-6 text-[var(--text-secondary)]">Posez-lui les questions de vos clients, avec votre cahier actuel.</p>
          <button type="button" (click)="createConversation()" class="btn-primary mt-4 w-full py-2.5 text-sm">Nouveau test</button>
        </div>

        <div class="flex-1 space-y-0.5 overflow-y-auto p-2">
          @for (conv of testConversations(); track conv.id) {
            <button type="button" (click)="selectConversation(conv)"
              class="w-full rounded-lg px-3 py-2.5 text-left transition"
              [class]="conv.id === selectedConversation()?.id ? 'bg-[var(--brand-primary-muted)]' : 'hover:bg-[var(--surface-tertiary)]'">
              <p class="truncate text-sm font-medium">{{ conv.title }}</p>
              <p class="mt-0.5 text-xs text-[var(--text-tertiary)]">{{ conv._count?.messages || 0 }} messages</p>
            </button>
          } @empty {
            <p class="p-4 text-sm leading-6 text-[var(--text-tertiary)]">
              Aucun test pour l'instant. Lancez-en un, et écrivez comme un client pressé.
            </p>
          }
        </div>
      </div>

      <!-- Conversation -->
      <div class="min-w-0 flex-1 flex-col md:flex" [class.hidden]="!selectedConversation()" [class.flex]="!!selectedConversation()">
        @if (selectedConversation(); as conv) {
          <div class="flex items-center gap-3 border-b border-[var(--border-primary)] px-4 py-3 sm:px-6">
            <button type="button" (click)="selectedConversation.set(null)" class="-ml-1 rounded-md p-1.5 text-[var(--text-secondary)] md:hidden" aria-label="Retour à la liste">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div class="min-w-0 flex-1">
              <h2 class="truncate font-semibold">{{ conv.title }}</h2>
              <p class="text-xs text-[var(--text-tertiary)]">
                {{ isVisitorConversation() ? 'Conversation d’un visiteur du site · lecture seule' : 'Test avec votre cahier actuel' }}
              </p>
            </div>
            @if (isVisitorConversation()) {
              <a routerLink="/conversations" class="hidden shrink-0 text-sm font-semibold text-[var(--brand-primary)] hover:underline sm:block">Toutes les questions</a>
            }
          </div>

          <div class="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6" #messagesContainer>
            @for (msg of messages(); track msg.id) {
              <div [class]="msg.role === 'USER' ? 'flex justify-end' : 'flex justify-start'">
                <div class="max-w-[85%] sm:max-w-[70%]">
                  <p class="mb-1 px-1 text-xs font-semibold"
                    [class]="msg.role === 'USER' ? 'text-right text-[var(--text-tertiary)]' : 'text-[var(--brand-primary)]'">
                    {{ msg.role === 'USER' ? (isVisitorConversation() ? 'Le client' : 'Vous, en client') : 'L’assistant' }}
                    <span class="font-normal text-[var(--text-tertiary)]">· {{ time(msg.createdAt) }}</span>
                  </p>
                  <p class="whitespace-pre-wrap rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed"
                    [class]="msg.role === 'USER'
                      ? 'rounded-tr-sm bg-[var(--brand-primary)] text-[var(--brand-on)]'
                      : 'rounded-tl-sm border border-[var(--border-primary)] bg-[var(--surface-secondary)]'">{{ msg.content }}</p>
                </div>
              </div>
            } @empty {
              @if (!isVisitorConversation()) {
                <div class="mx-auto max-w-sm pt-10 text-center text-[var(--text-secondary)]">
                  <p class="hand">Essayez :</p>
                  <div class="mt-3 flex flex-wrap justify-center gap-2">
                    @for (q of suggestions; track q) {
                      <button type="button" (click)="messageInput = q; sendMessage()"
                        class="rounded-full border border-[var(--border-secondary)] px-3 py-1.5 text-sm hover:bg-[var(--brand-primary-muted)]">{{ q }}</button>
                    }
                  </div>
                </div>
              }
            }

            @if (sending()) {
              <div class="flex justify-start">
                <p class="typing rounded-2xl rounded-tl-sm border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3.5 text-[var(--brand-primary)]"
                  role="status" aria-label="L'assistant écrit">
                  <span></span><span></span><span></span>
                </p>
              </div>
            }
          </div>

          @if (error()) {
            <p role="alert" class="mx-4 mb-2 rounded-lg bg-[var(--error-muted)] px-3 py-2 text-sm text-[var(--error)]">{{ error() }}</p>
          }
          @if (!isVisitorConversation()) {
            <form (ngSubmit)="sendMessage()" class="flex gap-2 border-t border-[var(--border-primary)] p-3 sm:p-4">
              <label class="sr-only" for="chat-input">Votre question</label>
              <input id="chat-input" type="text" [(ngModel)]="messageInput" name="message" autocomplete="off"
                class="field flex-1" placeholder="Bonsoir, vous livrez à Bingerville ?" [disabled]="sending()" />
              <button type="submit" [disabled]="sending() || !messageInput.trim()" class="btn-primary px-5">Envoyer</button>
            </form>
          }
        } @else {
          <div class="m-auto max-w-sm px-6 text-center">
            <h2 class="text-xl font-bold">Mettez-vous à la place d'un client</h2>
            <p class="mt-2 leading-7 text-[var(--text-secondary)]">
              Lancez un test et posez les questions qu'on vous pose déjà sur WhatsApp. Si une réponse ne vous plaît pas, corrigez le cahier.
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private readonly conversationsService = inject(ConversationsService);
  private readonly chatService = inject(ChatService);

  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLElement>;

  conversations = signal<Conversation[]>([]);
  selectedConversation = signal<Conversation | null>(null);
  messages = signal<Message[]>([]);
  messageInput = '';
  sending = signal(false);
  error = signal('');
  private shouldScrollToBottom = false;

  protected readonly suggestions = ['Vous êtes ouverts le dimanche ?', 'C’est combien la livraison ?', 'Je peux payer avec Wave ?'];

  /** ?id=… : conversation ouverte depuis la page Conversations */
  readonly id = input<string>();

  /** La barre latérale ne liste que les tests de l'équipe */
  readonly testConversations = computed(() => this.conversations().filter((c) => c.channel !== 'WIDGET'));
  readonly isVisitorConversation = computed(() => this.selectedConversation()?.channel === 'WIDGET');

  protected time(iso: string): string {
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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
    this.messages.set([]);
    this.selectedConversation.set(conv);
    this.chatService.getMessages(conv.id).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.shouldScrollToBottom = true;
      },
    });
  }

  createConversation() {
    const now = new Date();
    const title = `Test du ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
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
    this.shouldScrollToBottom = true;

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
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
