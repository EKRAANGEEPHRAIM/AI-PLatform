/** « il y a 3 min », « hier, 23:14 », « lundi »… : la date comme on la dirait au comptoir */
export function whenLabel(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const minutes = Math.round((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (date.getTime() >= startOfToday) return `aujourd'hui, ${time}`;
  if (date.getTime() >= startOfToday - 86_400_000) return `hier, ${time}`;
  if (date.getTime() >= startOfToday - 6 * 86_400_000) return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
