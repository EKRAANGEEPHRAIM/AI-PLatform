-- Akwaba : entreprises, base de connaissances, widget et conversations de visiteurs.
-- La première migration ne créait pas les entreprises (ajoutées hors migration) :
-- chaque instruction ci-dessous ne s'applique que si l'élément n'existe pas encore.

DO $$ BEGIN
  CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "Channel" AS ENUM ('INTERNAL', 'WIDGET');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_slug_key" ON "tenants"("slug");

ALTER TABLE "tenants"
  ADD COLUMN IF NOT EXISTS "knowledgeBase" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "contactInfo" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "welcomeMessage" TEXT NOT NULL DEFAULT 'Bonjour ! Comment puis-je vous aider ?',
  ADD COLUMN IF NOT EXISTS "brandColor" TEXT NOT NULL DEFAULT '#0f766e',
  ADD COLUMN IF NOT EXISTS "widgetKey" TEXT;

-- Clé de widget unique pour les entreprises existantes
UPDATE "tenants" SET "widgetKey" = md5(random()::text || "id") WHERE "widgetKey" IS NULL;
ALTER TABLE "tenants" ALTER COLUMN "widgetKey" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_widgetKey_key" ON "tenants"("widgetKey");

-- Rattachement des utilisateurs et des conversations à une entreprise
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "conversations"
  ADD COLUMN IF NOT EXISTS "tenantId" TEXT,
  ADD COLUMN IF NOT EXISTS "channel" "Channel" NOT NULL DEFAULT 'INTERNAL',
  ADD COLUMN IF NOT EXISTS "visitorId" TEXT;

-- Une conversation de widget n'a pas d'utilisateur connecté
ALTER TABLE "conversations" ALTER COLUMN "userId" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "conversations_tenantId_idx" ON "conversations"("tenantId");
CREATE INDEX IF NOT EXISTS "conversations_tenantId_visitorId_idx" ON "conversations"("tenantId", "visitorId");

DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
