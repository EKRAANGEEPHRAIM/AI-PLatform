import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Entreprise fictive « Boutique Adjoua » (Abidjan) pour la démo publique d'Akwaba.
// Relancer le seed remet sa base de connaissances et ses conversations à zéro.
const DEMO_EMAIL = 'demo@akwaba.app';
const DEMO_PASSWORD = 'Demo2026!';
const DEMO_SLUG = 'boutique-adjoua-demo';
/** Clé fixe : la page /demo du site l'utilise pour afficher le widget */
const DEMO_WIDGET_KEY = 'demo-boutique-adjoua';

const KNOWLEDGE_BASE = `Boutique Adjoua — pagnes, tissus wax et accessoires faits main.
Adresse : Cocody Riviera 2, rue des Jardins, Abidjan (face à la pharmacie des Jardins).
Horaires : du lundi au samedi de 9h à 19h. Fermé le dimanche et les jours fériés.

Produits et prix :
- Pagne wax 6 yards : de 12 000 à 25 000 FCFA selon le motif.
- Pagne Kita (tissé) : à partir de 45 000 FCFA.
- Robe en wax sur mesure : à partir de 18 000 FCFA, délai 5 jours ouvrés.
- Sacs en wax : 8 000 à 15 000 FCFA. Foulards et turbans : 3 500 FCFA.

Livraison :
- Abidjan : 1 500 FCFA (Cocody, Plateau, Marcory), 2 500 FCFA (Yopougon, Abobo, Port-Bouët). Livraison sous 24 h.
- Intérieur du pays : 3 000 FCFA par car, sous 2 à 3 jours.
- Gratuite à Abidjan dès 50 000 FCFA d'achat.

Paiement : espèces, Orange Money, MTN MoMo, Wave. Paiement à la livraison accepté à Abidjan.
Retours : échange possible sous 7 jours avec le ticket, article non lavé et non coupé. Pas de remboursement en espèces.
Commandes sur mesure : un acompte de 50 % est demandé.`;

const CONTACT_INFO = 'WhatsApp +225 07 00 00 00 00 (de 9h à 19h) ou en boutique à Cocody Riviera 2';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const daysAgo = (days: number, hour = 10): Date => {
  const date = new Date(Date.now() - days * 86_400_000);
  date.setHours(hour, 15, 0, 0);
  return date;
};

const CONVERSATIONS: { days: number; visitor: string; messages: [string, string][] }[] = [
  {
    days: 0,
    visitor: 'visiteur-demo-0001',
    messages: [
      ['Bonjour, vous livrez à Yopougon ?', 'Bonjour ! Oui, nous livrons à Yopougon pour 2 500 FCFA, sous 24 h. La livraison est gratuite à Abidjan dès 50 000 FCFA d\'achat.'],
      ['Et je peux payer avec Wave ?', 'Oui, vous pouvez payer par Wave, Orange Money, MTN MoMo ou en espèces. À Abidjan, le paiement à la livraison est aussi accepté.'],
    ],
  },
  {
    days: 1,
    visitor: 'visiteur-demo-0002',
    messages: [
      ['Combien coûte une robe en wax sur mesure ?', 'Une robe en wax sur mesure coûte à partir de 18 000 FCFA, avec un délai de 5 jours ouvrés. Un acompte de 50 % est demandé à la commande.'],
    ],
  },
  {
    days: 2,
    visitor: 'visiteur-demo-0003',
    messages: [
      ['Vous êtes ouverts dimanche ?', 'La boutique est fermée le dimanche. Nous vous accueillons du lundi au samedi, de 9h à 19h, à Cocody Riviera 2.'],
    ],
  },
  {
    days: 4,
    visitor: 'visiteur-demo-0004',
    messages: [
      ['Je veux échanger un pagne acheté la semaine dernière', 'L\'échange est possible sous 7 jours avec le ticket, si le pagne n\'est ni lavé ni coupé. Pour organiser l\'échange, contactez-nous sur WhatsApp au +225 07 00 00 00 00 ou passez en boutique.'],
    ],
  },
  {
    days: 6,
    visitor: 'visiteur-demo-0005',
    messages: [
      ['Vous vendez des chaussures ?', 'Je n\'ai pas d\'information sur des chaussures dans notre catalogue. Pour une demande précise, contactez-nous sur WhatsApp au +225 07 00 00 00 00.'],
    ],
  },
];

async function main(): Promise<void> {
  const tenant = await prisma.tenant.upsert({
    where: { slug: DEMO_SLUG },
    update: {
      name: 'Boutique Adjoua',
      knowledgeBase: KNOWLEDGE_BASE,
      contactInfo: CONTACT_INFO,
      welcomeMessage: 'Akwaba ! Je suis l\'assistante de Boutique Adjoua. Livraison, prix, horaires : posez-moi votre question.',
      brandColor: '#c2410c',
      widgetKey: DEMO_WIDGET_KEY,
    },
    create: {
      name: 'Boutique Adjoua',
      slug: DEMO_SLUG,
      knowledgeBase: KNOWLEDGE_BASE,
      contactInfo: CONTACT_INFO,
      welcomeMessage: 'Akwaba ! Je suis l\'assistante de Boutique Adjoua. Livraison, prix, horaires : posez-moi votre question.',
      brandColor: '#c2410c',
      widgetKey: DEMO_WIDGET_KEY,
    },
  });

  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { password, name: 'Adjoua Kouassi', tenantId: tenant.id },
    create: { email: DEMO_EMAIL, password, name: 'Adjoua Kouassi', tenantId: tenant.id },
  });

  // Messages supprimés en cascade avec les conversations
  await prisma.conversation.deleteMany({ where: { tenantId: tenant.id } });

  for (const seed of CONVERSATIONS) {
    const conversation = await prisma.conversation.create({
      data: {
        title: seed.messages[0][0],
        channel: 'WIDGET',
        visitorId: seed.visitor,
        tenantId: tenant.id,
        status: seed.days > 3 ? 'RESOLVED' : 'ACTIVE',
        createdAt: daysAgo(seed.days),
        updatedAt: daysAgo(seed.days, 11),
      },
    });
    let minute = 0;
    for (const [question, answer] of seed.messages) {
      const at = daysAgo(seed.days);
      at.setMinutes(15 + minute);
      await prisma.message.create({ data: { conversationId: conversation.id, role: 'USER', content: question, createdAt: at } });
      await prisma.message.create({
        data: { conversationId: conversation.id, role: 'ASSISTANT', content: answer, createdAt: new Date(at.getTime() + 4000) },
      });
      minute += 2;
    }
  }

  console.log(`Seed terminé : Boutique Adjoua, compte ${DEMO_EMAIL}, ${CONVERSATIONS.length} conversations de visiteurs`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
