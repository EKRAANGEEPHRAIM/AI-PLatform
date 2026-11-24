import { whenLabel } from './when';

describe('whenLabel', () => {
  // Mardi 24 novembre 2026, 10 h, heure locale
  const now = new Date(2026, 10, 24, 10, 0);
  const at = (day: number, hour: number, minute = 0) => new Date(2026, 10, day, hour, minute).toISOString();

  it('moins d’une minute : à l’instant', () => {
    expect(whenLabel(new Date(now.getTime() - 20_000).toISOString(), now)).toBe('à l\'instant');
  });

  it('moins d’une heure : en minutes', () => {
    expect(whenLabel(at(24, 9, 48), now)).toBe('il y a 12 min');
  });

  it('plus tôt dans la journée : aujourd’hui avec l’heure', () => {
    expect(whenLabel(at(24, 7, 40), now)).toBe('aujourd\'hui, 07:40');
  });

  it('la veille : hier avec l’heure', () => {
    expect(whenLabel(at(23, 23, 14), now)).toBe('hier, 23:14');
  });

  it('dans la semaine : le jour', () => {
    expect(whenLabel(at(20, 12), now)).toBe('vendredi');
  });

  it('au-delà : la date courte', () => {
    expect(whenLabel(at(2, 12), now)).toBe('2 nov.');
  });
});
