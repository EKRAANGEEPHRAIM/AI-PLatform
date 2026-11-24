import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// La CLI Prisma (migrate, seed) utilise l'adresse poolée de Neon, comme l'application :
// l'hôte direct (sans "-pooler") est injoignable depuis Render et depuis certains réseaux (P1001).
// DIRECT_URL reste prise en compte si on veut forcer une autre adresse.
const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: directUrl,
  },
});
