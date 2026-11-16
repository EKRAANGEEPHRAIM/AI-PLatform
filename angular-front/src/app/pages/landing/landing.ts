import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/** Page publique de présentation d'Akwaba */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-dvh overflow-y-auto' },
  template: `
    <div class="min-h-full bg-[#f6fbfa] text-slate-800">
      <header class="sticky top-0 z-40 border-b border-teal-900/10 bg-[#f6fbfa]/90 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a routerLink="/" class="flex items-center gap-2.5">
            <span class="grid size-9 place-items-center rounded-xl bg-[#0f766e] text-white">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </span>
            <span class="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">Akwaba</span>
          </a>
          <nav class="flex items-center gap-2 text-sm font-semibold">
            <a routerLink="/demo" class="hidden rounded-lg px-3 py-2 text-slate-600 hover:text-slate-900 sm:block">Voir la démo</a>
            @if (auth.isAuthenticated()) {
              <a routerLink="/dashboard" class="rounded-xl bg-[#0f766e] px-4 py-2.5 text-white hover:bg-[#115e59]">Mon espace</a>
            } @else {
              <a routerLink="/login" class="rounded-lg px-3 py-2 text-slate-600 hover:text-slate-900">Connexion</a>
              <a routerLink="/register" class="rounded-xl bg-[#0f766e] px-4 py-2.5 text-white hover:bg-[#115e59]">Créer mon assistant</a>
            }
          </nav>
        </div>
      </header>

      <!-- Accroche -->
      <section class="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
            Pour les boutiques, restaurants, cliniques et écoles
          </span>
          <h1 class="mt-6 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Vos clients ont une question à 23h ?
            <span class="text-[#0f766e]">Votre assistant répond.</span>
          </h1>
          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Akwaba installe sur votre site un assistant qui connaît vos prix, vos horaires, votre livraison et vos
            moyens de paiement. Il répond en français, 24h/24, et passe la main à votre équipe quand il ne sait pas.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/demo" class="rounded-xl bg-[#0f766e] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-900/20 hover:bg-[#115e59]">Parler à l'assistant d'une boutique</a>
            <a routerLink="/login" [queryParams]="{ demo: 1 }" class="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50">Voir l'espace de l'entreprise</a>
          </div>
        </div>

        <!-- Aperçu de conversation -->
        <div class="mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl shadow-teal-900/15">
          <div class="flex items-center gap-3 bg-[#c2410c] px-4 py-3 text-white">
            <div class="grid size-9 place-items-center rounded-full bg-white/20 text-sm font-bold">B</div>
            <div><p class="text-sm font-semibold">Boutique Adjoua</p><p class="text-xs text-white/80">Répond en quelques secondes</p></div>
          </div>
          <div class="space-y-3 bg-slate-50 p-4 text-sm">
            <div class="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#c2410c] px-3.5 py-2.5 text-white">Bonsoir, vous livrez à Yopougon demain ?</div>
            <div class="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm">Bonsoir ! Oui, la livraison à Yopougon coûte 2 500 FCFA, sous 24 h. Elle est gratuite dès 50 000 FCFA d'achat.</div>
            <div class="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#c2410c] px-3.5 py-2.5 text-white">Je peux payer avec Wave ?</div>
            <div class="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm">Oui : Wave, Orange Money, MTN MoMo, ou en espèces à la livraison.</div>
          </div>
        </div>
      </section>

      <!-- Comment ça marche -->
      <section class="border-y border-teal-900/10 bg-white py-20">
        <div class="mx-auto max-w-6xl px-5">
          <h2 class="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Prêt en 10 minutes, sans compétence technique</h2>
          <ol class="mt-12 grid gap-6 md:grid-cols-3">
            @for (step of steps; track step.title; let i = $index) {
              <li class="rounded-2xl border border-slate-200 p-6">
                <span class="grid size-10 place-items-center rounded-full bg-teal-50 font-bold text-[#0f766e]">{{ i + 1 }}</span>
                <h3 class="mt-4 font-semibold text-slate-900">{{ step.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.text }}</p>
              </li>
            }
          </ol>
        </div>
      </section>

      <!-- Garanties -->
      <section class="py-20">
        <div class="mx-auto grid max-w-6xl gap-5 px-5 md:grid-cols-3">
          @for (point of points; track point.title) {
            <article class="rounded-2xl bg-white p-6 shadow-sm">
              <h3 class="font-semibold text-slate-900">{{ point.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ point.text }}</p>
            </article>
          }
        </div>
      </section>

      <section class="px-5 pb-20">
        <div class="mx-auto max-w-6xl rounded-3xl bg-[#0f766e] px-8 py-14 text-center text-white">
          <h2 class="font-[family-name:var(--font-display)] text-3xl font-bold">Essayez-le comme un client</h2>
          <p class="mx-auto mt-3 max-w-xl text-teal-100">Ouvrez le site de démonstration de Boutique Adjoua et posez vos questions à son assistante.</p>
          <a routerLink="/demo" class="mt-8 inline-block rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-orange-600">Ouvrir la démo</a>
        </div>
      </section>

      <footer class="border-t border-teal-900/10 py-8 text-center text-sm text-slate-500">
        Akwaba — projet de démonstration développé par Ange Ephraïm Ekra · Angular, NestJS, PostgreSQL, IA
      </footer>
    </div>
  `,
})
export class LandingComponent {
  protected readonly auth = inject(AuthService);

  protected readonly steps = [
    { title: 'Collez vos informations', text: 'Prix, horaires, adresse, livraison, paiement, retours : en texte simple, comme vous les diriez à un vendeur.' },
    { title: 'Testez votre assistant', text: 'Posez-lui les questions de vos clients et ajustez vos informations jusqu\'à ce que les réponses soient justes.' },
    { title: 'Collez une ligne sur votre site', text: 'Une seule ligne de code à ajouter : la bulle de chat apparaît sur toutes vos pages.' },
  ];

  protected readonly points = [
    { title: 'Il n\'invente rien', text: 'L\'assistant répond uniquement à partir de vos informations. S\'il ne sait pas, il donne votre WhatsApp ou votre téléphone.' },
    { title: 'Vous voyez tout', text: 'Chaque conversation de vos visiteurs est enregistrée : vous savez ce que vos clients demandent vraiment.' },
    { title: 'Protégé contre les abus', text: 'Nombre de messages limité par visiteur et par jour, pour garder votre service et votre budget sous contrôle.' },
  ];
}
