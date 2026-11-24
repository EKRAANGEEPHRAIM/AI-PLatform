import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandComponent } from './brand';

/**
 * Cadre des pages Connexion et Inscription : le formulaire sur le papier,
 * et à côté (grand écran) une vraie question de client avec la réponse de l'assistant.
 */
@Component({
  selector: 'app-auth-shell',
  imports: [RouterLink, BrandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-h-dvh bg-[var(--surface-primary)] text-[var(--text-primary)]' },
  template: `
    <div class="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,34rem)]">
      <div class="flex flex-col px-4 py-6 sm:px-10">
        <a routerLink="/" class="self-start" aria-label="Retour à l'accueil d'Akwaba"><app-brand /></a>
        <main class="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <ng-content />
        </main>
      </div>

      <aside class="relative hidden overflow-hidden bg-[#1f5135] p-12 text-[#f3eee2] lg:flex lg:flex-col lg:justify-end">
        <div class="ruled absolute -right-10 top-14 w-80 rotate-[4deg] rounded-sm p-0 pb-6 text-sm text-[#2a2a24] opacity-95 shadow-2xl shadow-black/40"
          style="--ruled-line: rgba(31,81,53,.12); --margin-line: rgba(196,85,47,.45); background-color: #fffdf6">
          <p class="pl-14 pt-2 font-[family-name:var(--font-hand)] text-xl text-[#1f5135]">Le cahier</p>
          <p class="pl-14 pr-4">Livraison Yopougon : 2 500 F.</p>
          <p class="pl-14 pr-4">Wave, Orange Money, MoMo.</p>
          <p class="pl-14 pr-4">Fermé le dimanche.</p>
        </div>

        <div class="relative max-w-sm space-y-3">
          <p class="ml-auto w-fit rounded-2xl rounded-tr-sm bg-[#b5441f] px-4 py-2.5 text-white">Vous êtes ouverts dimanche ?</p>
          <p class="w-fit rounded-2xl rounded-tl-sm bg-[#fffdf8] px-4 py-2.5 text-[#1c2620]">
            La boutique est fermée le dimanche. Nous vous accueillons du lundi au samedi, de 9h à 19h, à Cocody Riviera 2.
          </p>
          <p class="pt-6 text-sm leading-6 text-[#cfd9cf]">
            Une conversation de la boutique de démonstration. Tout ce que dit l'assistant vient du cahier.
          </p>
        </div>
      </aside>
    </div>
  `,
})
export class AuthShellComponent {}
