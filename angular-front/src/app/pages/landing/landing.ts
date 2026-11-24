import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BrandComponent } from '../../shared/brand';

interface NotebookLine {
  n: number;
  text: string;
}

interface Exchange {
  question: string;
  answer: string;
  /** Ligne du cahier d'où vient la réponse ; null : l'info n'y est pas */
  line: number | null;
}

/** Page publique de présentation d'Akwaba */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, BrandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-dvh overflow-y-auto' },
  template: `
    <div class="min-h-full bg-[var(--surface-primary)] text-[var(--text-primary)]">
      <header class="sticky top-0 z-40 border-b border-[var(--border-primary)] bg-[var(--surface-primary)]/90 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <a routerLink="/" aria-label="Akwaba, accueil"><app-brand /></a>
          <nav class="flex items-center gap-1 text-sm font-semibold sm:gap-2">
            <a href="#cahier" class="hidden rounded-lg px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] md:block">Comment il répond</a>
            <a routerLink="/demo" class="hidden rounded-lg px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:block">La boutique de démo</a>
            @if (auth.isAuthenticated()) {
              <a routerLink="/dashboard" class="btn-primary px-4 py-2.5">Mon espace</a>
            } @else {
              <a routerLink="/login" class="rounded-lg px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Connexion</a>
              <a routerLink="/register" class="btn-primary px-4 py-2.5">Créer mon assistant</a>
            }
          </nav>
        </div>
      </header>

      <!-- Accroche : une scène, pas un slogan -->
      <section class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pb-24 lg:pt-20">
        <div>
          <p class="text-sm font-semibold text-[var(--accent)]">Mardi, 23 h 14 · Cocody Riviera 2</p>
          <h1 class="mt-4 text-[2.5rem] font-extrabold leading-[1.02] sm:text-6xl">
            La boutique est fermée.
            <span class="block text-[var(--brand-primary)]">Les clients, eux, <span class="underline-draw">écrivent encore.</span></span>
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
            Akwaba répond à leur place sur votre site : prix, livraison, horaires, moyens de paiement.
            Il ne dit que ce que vous lui avez écrit, et le lendemain matin vous lisez tout ce qu'on vous a demandé.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/demo" class="btn-primary px-5 py-3.5">Écrire à la boutique de démo</a>
            <a routerLink="/login" [queryParams]="{ demo: 1 }" class="btn-ghost px-5 py-3.5">Voir le côté commerçant</a>
          </div>
          <p class="mt-5 text-sm text-[var(--text-tertiary)]">Gratuit à tester · aucune carte bancaire · une ligne à coller sur votre site</p>
        </div>

        <!-- La conversation de 23 h 14, qui s'écrit sous les yeux du visiteur -->
        <figure class="relative mx-auto w-full max-w-sm">
          <div class="card overflow-hidden">
            <div class="flex items-center gap-3 bg-[#b5441f] px-4 py-3 text-white">
              <div class="grid size-9 place-items-center rounded-full bg-white/20 text-sm font-bold">A</div>
              <div class="min-w-0">
                <p class="text-sm font-semibold">Boutique Adjoua</p>
                <p class="text-xs text-white/80">Répond en quelques secondes</p>
              </div>
            </div>
            <div class="space-y-2.5 bg-[#faf7f1] p-4 text-[0.9rem] leading-snug text-[#2a2520]">
              @for (m of heroThread; track $index) {
                <div class="arrive" [style.animation-delay.ms]="m.delay" [class]="m.from === 'client' ? 'ml-auto max-w-[85%] text-right' : 'max-w-[88%]'">
                  <p [class]="m.from === 'client'
                      ? 'inline-block rounded-2xl rounded-tr-sm bg-[#b5441f] px-3.5 py-2.5 text-left text-white'
                      : 'rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm'">{{ m.text }}</p>
                  <p class="mt-1 px-1 text-[0.7rem] text-[#7a7266]">{{ m.time }}</p>
                </div>
              }
            </div>
          </div>
          <figcaption class="hand arrive absolute -bottom-10 right-2 rotate-[-3deg] sm:-right-6" style="animation-delay: 3600ms">
            Adjoua dormait.
          </figcaption>
        </figure>
      </section>

      <!-- Le cahier : d'où viennent les réponses -->
      <section id="cahier" class="scroll-mt-20 bg-[#1f5135] py-20 text-[#f3eee2]">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="max-w-2xl">
            <p class="text-sm font-semibold text-[#f0ad8c]">Comment il répond</p>
            <h2 class="mt-3 text-3xl font-bold leading-tight sm:text-[2.6rem]">Il ne répond qu'avec ce que vous avez écrit dans son cahier.</h2>
            <p class="mt-4 text-lg leading-8 text-[#cfd9cf]">
              Comme le cahier posé à côté de la caisse : vos prix, vos quartiers de livraison, vos horaires.
              Quand la réponse n'y est pas, il n'invente pas : il donne votre WhatsApp.
            </p>
          </div>

          <div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <!-- Le cahier de Boutique Adjoua -->
            <div class="ruled overflow-hidden rounded-md text-[0.92rem] text-[#2a2a24] shadow-2xl shadow-black/30"
              style="--ruled-line: rgba(31,81,53,.12); --margin-line: rgba(196,85,47,.45); background-color: #fffdf6">
              <p class="pl-14 pr-4 pt-3 font-[family-name:var(--font-hand)] text-2xl text-[#1f5135]">Boutique Adjoua</p>
              <ol>
                @for (line of notebook; track line.n) {
                  <li class="flex pr-4">
                    <span class="w-11 shrink-0 text-right font-mono text-xs leading-7 text-[#a39883]">{{ line.n }}</span>
                    <span class="pl-3">{{ line.text }}</span>
                  </li>
                }
              </ol>
              <div class="h-7"></div>
            </div>

            <!-- Ce que les clients ont demandé, et la ligne utilisée -->
            <ul class="space-y-4">
              @for (ex of exchanges; track ex.question) {
                <li class="rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                  <p class="text-sm text-[#cfd9cf]">« {{ ex.question }} »</p>
                  <p class="mt-2 leading-7">{{ ex.answer }}</p>
                  @if (ex.line) {
                    <p class="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 font-mono text-xs text-[#e8f0e8]">
                      <span aria-hidden="true">↳</span> tiré de la ligne {{ ex.line }}
                    </p>
                  } @else {
                    <p class="mt-3 inline-flex items-center gap-2 rounded-full bg-[#b84d28] px-2.5 py-1 text-xs font-semibold text-white">
                      Pas dans le cahier : il passe la main
                    </p>
                  }
                </li>
              }
            </ul>
          </div>
        </div>
      </section>

      <!-- Le lendemain matin -->
      <section class="py-20">
        <div class="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p class="text-sm font-semibold text-[var(--accent)]">Le lendemain, 7 h 40</p>
            <h2 class="mt-3 text-3xl font-bold leading-tight sm:text-[2.6rem]">Vous savez enfin ce que vos clients demandent.</h2>
            <p class="mt-4 text-lg leading-8 text-[var(--text-secondary)]">
              Chaque conversation est gardée. Les questions qui reviennent montrent ce qui manque sur votre site ;
              celles restées sans réponse vous disent quoi ajouter au cahier.
            </p>
          </div>

          <div class="card p-5 sm:p-6">
            <div class="flex items-baseline justify-between gap-3">
              <h3 class="text-lg font-bold">Hier soir sur votre site</h3>
              <span class="text-sm text-[var(--text-tertiary)]">19 questions</span>
            </div>
            <ul class="mt-4 divide-y divide-[var(--border-primary)]">
              @for (q of morning; track q.label) {
                <li class="flex items-center justify-between gap-4 py-3">
                  <span class="min-w-0">
                    <span class="block truncate">{{ q.label }}</span>
                    @if (q.missing) {
                      <span class="text-xs font-semibold text-[var(--accent)]">Sans réponse : à ajouter au cahier</span>
                    }
                  </span>
                  <span class="flex shrink-0 items-center gap-2">
                    <span class="h-1.5 rounded-full" [style.width.px]="q.count * 9" [style.background]="q.missing ? 'var(--accent)' : 'var(--brand-primary)'"></span>
                    <span class="w-6 text-right font-mono text-sm text-[var(--text-secondary)]">{{ q.count }}</span>
                  </span>
                </li>
              }
            </ul>
          </div>
        </div>
      </section>

      <!-- Mise en place -->
      <section class="border-y border-[var(--border-primary)] bg-[var(--surface-secondary)] py-20">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 class="max-w-2xl text-3xl font-bold leading-tight sm:text-[2.6rem]">Une soirée pour l'installer. Pas besoin de développeur.</h2>
          <ol class="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            @for (step of steps; track step.title; let i = $index) {
              <li class="border-t-2 border-[var(--text-primary)] pt-5">
                <p class="font-mono text-sm text-[var(--text-tertiary)]">0{{ i + 1 }}</p>
                <h3 class="mt-2 text-xl font-bold">{{ step.title }}</h3>
                <p class="mt-2 leading-7 text-[var(--text-secondary)]">{{ step.text }}</p>
              </li>
            }
          </ol>
          <pre class="mt-10 overflow-x-auto rounded-lg bg-[#1c2620] px-4 py-3.5 font-mono text-[0.8rem] leading-6 text-[#e6e0d2]"><code><span class="text-[#9db3a3]">&lt;!-- avant &lt;/body&gt;, sur n'importe quel site --&gt;</span>
&lt;script src="https://…/widget.js" data-akwaba-key="votre-clé" async&gt;&lt;/script&gt;</code></pre>
        </div>
      </section>

      <!-- Ce qu'il ne fait pas -->
      <section class="py-20">
        <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <h2 class="text-3xl font-bold leading-tight sm:text-[2.6rem]">Ce qu'Akwaba ne fait pas, volontairement.</h2>
          <dl class="grid gap-6 sm:grid-cols-2">
            @for (item of limits; track item.title) {
              <div>
                <dt class="font-bold">{{ item.title }}</dt>
                <dd class="mt-1.5 leading-7 text-[var(--text-secondary)]">{{ item.text }}</dd>
              </div>
            }
          </dl>
        </div>
      </section>

      <section class="px-4 pb-20 sm:px-6">
        <div class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl bg-[#b84d28] px-6 py-10 text-white sm:px-10 md:flex-row md:items-center">
          <div>
            <h2 class="text-2xl font-bold sm:text-3xl">Écrivez à Boutique Adjoua comme un client.</h2>
            <p class="mt-2 max-w-xl text-white/90">La boutique est fictive, son assistante non : demandez-lui la livraison à Abobo, ou si elle vend des chaussures.</p>
          </div>
          <a routerLink="/demo" class="shrink-0 rounded-lg bg-white px-5 py-3.5 font-semibold text-[#8f3818] hover:bg-[#fff4ee]">Ouvrir la boutique</a>
        </div>
      </section>

      <footer class="border-t border-[var(--border-primary)]">
        <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <app-brand [size]="22" />
          <p>Conçu et développé en Côte d'Ivoire par Ange Ephraïm Ekra · Angular, NestJS, PostgreSQL</p>
        </div>
      </footer>
    </div>
  `,
})
export class LandingComponent {
  protected readonly auth = inject(AuthService);

  protected readonly heroThread = [
    { from: 'client', text: 'Bonsoir, vous livrez à Yopougon demain ?', time: '23:14', delay: 300 },
    { from: 'shop', text: 'Bonsoir ! Oui : 2 500 FCFA, livré sous 24 h. Et c\'est gratuit dès 50 000 FCFA d\'achat.', time: '23:14', delay: 1300 },
    { from: 'client', text: 'Je peux payer avec Wave ?', time: '23:15', delay: 2300 },
    { from: 'shop', text: 'Oui. Wave, Orange Money, MTN MoMo, ou en espèces à la livraison.', time: '23:15', delay: 3100 },
  ];

  protected readonly notebook: NotebookLine[] = [
    { n: 1, text: 'Ouvert lundi → samedi, 9 h – 19 h. Fermé dimanche.' },
    { n: 2, text: 'Cocody Riviera 2, face pharmacie des Jardins.' },
    { n: 3, text: 'Pagne wax 6 yards : 12 000 à 25 000 F.' },
    { n: 4, text: 'Robe sur mesure : dès 18 000 F, 5 jours, acompte 50 %.' },
    { n: 5, text: 'Livraison Cocody, Plateau, Marcory : 1 500 F.' },
    { n: 6, text: 'Yopougon, Abobo, Port-Bouët : 2 500 F. Sous 24 h.' },
    { n: 7, text: 'Gratuit à Abidjan dès 50 000 F.' },
    { n: 8, text: 'Wave, Orange Money, MTN MoMo, espèces.' },
    { n: 9, text: 'Échange sous 7 jours avec le ticket.' },
  ];

  protected readonly exchanges: Exchange[] = [
    { question: 'C\'est combien la livraison à Abobo ?', answer: '2 500 FCFA, livrée sous 24 h.', line: 6 },
    { question: 'Une robe sur mesure, ça prend combien de temps ?', answer: 'Cinq jours ouvrés, à partir de 18 000 FCFA. Un acompte de 50 % est demandé.', line: 4 },
    { question: 'Vous vendez des chaussures ?', answer: 'Je n\'ai pas cette information. Écrivez à Adjoua sur WhatsApp au +225 07 00 00 00 00, elle vous répondra.', line: null },
  ];

  protected readonly morning = [
    { label: 'Livraison à Yopougon ou Abobo ?', count: 7, missing: false },
    { label: 'Paiement par Wave ?', count: 5, missing: false },
    { label: 'Ouvert le dimanche ?', count: 3, missing: false },
    { label: 'Tenue pour un mariage ?', count: 2, missing: true },
    { label: 'Prix d\'un pagne Kita ?', count: 2, missing: false },
  ];

  protected readonly steps = [
    { title: 'Remplissez le cahier', text: 'Prix, horaires, quartiers livrés, paiement, retours. En phrases simples, comme vous l\'expliqueriez à une nouvelle vendeuse.' },
    { title: 'Posez-lui vos questions', text: 'Testez-le avec les questions que vos clients posent déjà sur WhatsApp, et corrigez le cahier tant qu\'une réponse ne vous plaît pas.' },
    { title: 'Collez une ligne', text: 'Sur votre site, avant la fin de la page. La bulle apparaît en bas à droite, à vos couleurs, sur toutes les pages.' },
  ];

  protected readonly limits = [
    { title: 'Il n\'invente pas', text: 'Pas de prix, de délai ni de promesse qui ne soient dans votre cahier. Sinon, il renvoie vers vous.' },
    { title: 'Il ne prend pas de commande', text: 'Ni paiement, ni réservation : il renseigne, puis oriente vers votre WhatsApp ou votre boutique.' },
    { title: 'Il ne remplace pas votre équipe', text: 'Les réclamations et les cas particuliers vont toujours à un humain.' },
    { title: 'Pas de facture surprise', text: 'Messages limités par visiteur et par jour, même si quelqu\'un s\'amuse à le bombarder de questions.' },
  ];
}
