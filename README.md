# Akwaba — l'assistant qui répond à vos clients 24h/24

Akwaba installe sur le site d'une PME (boutique, restaurant, clinique, école) un assistant de service client qui
connaît **ses** prix, horaires, conditions de livraison et moyens de paiement. Il répond en français, à toute heure,
et donne le WhatsApp ou le téléphone de l'entreprise quand il ne connaît pas la réponse.

> Projet de démonstration développé par Ange Ephraïm Ekra : Angular 22, NestJS 11, PostgreSQL (Neon), Prisma 7,
> IA via Groq (Llama 3.3).

## Ce que fait l'application

| Pour l'entreprise | Pour ses clients |
| --- | --- |
| **Base de connaissances** : un texte simple (prix, horaires, livraison, paiement, retours) ; l'assistant n'invente rien en dehors. | **Bulle de chat** sur le site, aux couleurs de l'entreprise. |
| **Test** de l'assistant avant installation. | Réponses en quelques secondes, de jour comme de nuit. |
| **Installation en une ligne** : `<script src=".../widget.js" data-akwaba-key="…" async></script>`. | Aucun compte à créer. |
| **Conversations des visiteurs** en lecture, pour savoir ce que les clients demandent vraiment. | |
| **Tableau de bord** : volume de conversations et de messages. | |

**Garde-fous** : 200 messages par entreprise et par jour, 20 par visiteur et par heure (réglables), pour maîtriser
le coût de l'IA. Chaque entreprise ne voit que ses propres conversations.

## Démo

- **Site de démonstration** : `/demo`, la boutique fictive *Boutique Adjoua* (pagnes wax, Abidjan) avec son assistante.
- **Espace entreprise** : `/login?demo=1` se connecte avec le compte de démonstration
  (`demo@akwaba.app` / `Demo2026!`, données fictives créées par le seed).

## Lancer en local

Prérequis : Node 22+, une base PostgreSQL (Neon gratuit) et une clé Groq gratuite (console.groq.com).

```bash
cd backend
cp .env.example .env        # renseigner DATABASE_URL, JWT_SECRET, AI_API_KEY
npm install
npx prisma migrate deploy
npx prisma db seed          # Boutique Adjoua + compte de démo
npm run start:dev           # http://localhost:3000/api/v1
```

```bash
cd angular-front
npm install
npx ng serve                # http://localhost:4200
```

Sans `AI_API_KEY` valide, tout fonctionne sauf les réponses : l'assistant affiche
« L'assistant est momentanément indisponible ».

## Mise en ligne

**API sur Render** : le fichier `render.yaml` à la racine crée le service `akwaba-api` (Blueprint).
Dans le tableau de bord Render, renseigner :

- `DATABASE_URL` (Neon, URL poolée) ;
- `AI_API_KEY` (Groq) ;
- `FRONTEND_URL` : l'URL Vercel du site, pour CORS.

Les migrations s'appliquent à chaque déploiement. Pour charger la démo une fois, lancer `npx prisma db seed` avec
la même `DATABASE_URL`.

**Site sur Vercel** : importer le dépôt avec `angular-front` comme *Root Directory*. `vercel.json` renvoie
`/api/*` vers l'API Render (`https://akwaba-api-hf7d.onrender.com`), à adapter si Render donne une autre adresse. Le site et le
widget sont donc servis depuis le même domaine.

## Architecture

```
angular-front/   Angular 22 (standalone, signals, zoneless, Tailwind 4)
  pages/landing    présentation publique
  pages/demo       site fictif de Boutique Adjoua avec le widget
  pages/widget     le chat chargé dans l'iframe des sites clients (/widget/:clé)
  pages/assistant  base de connaissances, apparence, code d'installation
  public/widget.js script à coller sur le site du client (bulle + iframe)
backend/         NestJS 11 + Prisma 7
  tenant/          une entreprise = une base de connaissances + une clé de widget
  widget/          API publique du widget, avec limites de messages
  assistant/       appel au modèle (Groq par défaut, tout fournisseur compatible OpenAI)
  chat/, conversations/, analytics/  espace de l'entreprise, protégé par JWT
```
