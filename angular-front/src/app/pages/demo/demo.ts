import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

/** Clé fixe du widget de démonstration, créée par le seed du backend */
const DEMO_WIDGET_KEY = 'demo-boutique-adjoua';

/**
 * Site fictif d'une boutique cliente, avec le widget Akwaba installé :
 * montre au prospect exactement ce que verront ses propres clients.
 */
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-dvh overflow-y-auto' },
  template: `
    <div class="min-h-full bg-[#fdf8f3] text-stone-800">
      <div class="bg-stone-900 px-4 py-2 text-center text-xs text-stone-200">
        Site de démonstration : la boutique est fictive. Ouvrez la bulle en bas à droite et posez une question.
        <a routerLink="/" class="ml-2 font-semibold text-orange-300 underline">Retour à Akwaba</a>
      </div>

      <header class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <p class="font-[family-name:var(--font-display)] text-2xl font-bold text-orange-800">Boutique Adjoua</p>
        <nav class="hidden gap-6 text-sm text-stone-600 sm:flex">
          <span>Pagnes</span><span>Sur mesure</span><span>Accessoires</span><span>Livraison</span>
        </nav>
      </header>

      <section class="mx-auto grid max-w-5xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <div>
          <p class="text-sm font-semibold uppercase tracking-widest text-orange-700">Cocody Riviera 2 · Abidjan</p>
          <h1 class="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">Pagnes wax et créations sur mesure</h1>
          <p class="mt-4 text-stone-600">Livraison partout à Abidjan en 24 h. Paiement Orange Money, MTN MoMo, Wave ou à la livraison.</p>
          <button type="button" (click)="open.set(true)" class="mt-6 rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-800">
            Une question ? Demandez à l'assistante
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          @for (item of products; track item.name) {
            <div class="rounded-2xl bg-white p-4 shadow-sm">
              <div class="h-28 rounded-xl" [style.background]="item.pattern"></div>
              <p class="mt-3 text-sm font-semibold">{{ item.name }}</p>
              <p class="text-sm text-orange-800">{{ item.price }}</p>
            </div>
          }
        </div>
      </section>

      <section class="mx-auto max-w-5xl px-6 pb-24">
        <p class="text-sm font-semibold text-stone-500">Questions que vous pouvez poser à l'assistante :</p>
        <div class="mt-3 flex flex-wrap gap-2">
          @for (question of questions; track question) {
            <span class="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700">{{ question }}</span>
          }
        </div>
      </section>
    </div>

    <!-- Widget Akwaba, tel que l'installe widget.js sur le site d'un client -->
    @if (open()) {
      <iframe
        [src]="widgetUrl"
        title="Assistant du service client"
        class="fixed bottom-24 right-5 z-50 h-[560px] max-h-[calc(100dvh-120px)] w-[370px] max-w-[calc(100vw-40px)] rounded-2xl border-0 bg-white shadow-2xl"
      ></iframe>
    }
    <button
      type="button"
      (click)="open.set(!open())"
      [attr.aria-label]="open() ? 'Fermer le chat' : 'Ouvrir le chat'"
      class="fixed bottom-5 right-5 z-50 grid size-[60px] place-items-center rounded-full bg-[#c2410c] text-white shadow-xl"
    >
      @if (open()) {
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      } @else {
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      }
    </button>
  `,
})
export class DemoComponent {
  protected readonly open = signal(false);
  // Adresse constante de notre propre application : sûre pour une iframe
  protected readonly widgetUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(`/widget/${DEMO_WIDGET_KEY}`);

  protected readonly products = [
    { name: 'Pagne wax 6 yards', price: 'dès 12 000 FCFA', pattern: 'repeating-linear-gradient(45deg,#c2410c 0 14px,#fbbf24 14px 28px,#065f46 28px 42px)' },
    { name: 'Pagne Kita', price: 'dès 45 000 FCFA', pattern: 'repeating-linear-gradient(90deg,#78350f 0 10px,#facc15 10px 20px,#15803d 20px 30px)' },
    { name: 'Robe sur mesure', price: 'dès 18 000 FCFA', pattern: 'radial-gradient(circle at 30% 30%,#fb923c 0 18px,#7c2d12 19px 30px,#fde68a 31px)' },
    { name: 'Sac en wax', price: '8 000 à 15 000 FCFA', pattern: 'repeating-radial-gradient(circle,#0f766e 0 8px,#f97316 8px 16px,#fef3c7 16px 24px)' },
  ];

  protected readonly questions = [
    'Vous livrez à Yopougon ?',
    'Combien coûte une robe sur mesure ?',
    'Je peux payer avec Wave ?',
    'Vous êtes ouverts le dimanche ?',
  ];
}
