import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Marque Akwaba : une bulle de conversation dont la « porte » est entrouverte
 * (akwaba = bienvenue), avec un point terre cuite : quelqu'un répond.
 */
@Component({
  selector: 'app-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center gap-2' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 4h20a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H14l-6 5v-5H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" [attr.fill]="onDark() ? '#fffdf8' : 'var(--brand-primary)'" />
      <path d="M12 20V10.5a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5V20" fill="none" [attr.stroke]="onDark() ? '#1f5135' : 'var(--brand-on)'" stroke-width="2" stroke-linecap="round" />
      <circle cx="17.6" cy="15" r="1.6" fill="#c4552f" />
    </svg>
    @if (withName()) {
      <span class="font-[family-name:var(--font-display)] text-[1.35rem] font-extrabold leading-none tracking-tight"
        [style.color]="onDark() ? '#fffdf8' : 'var(--text-primary)'">akwaba</span>
    }
  `,
})
export class BrandComponent {
  readonly size = input(30);
  readonly withName = input(true);
  /** Sur un fond vert foncé */
  readonly onDark = input(false);
}
