import { z } from 'zod';

export const WidgetMessageSchema = z.object({
  /** Identifiant anonyme généré par le navigateur du visiteur */
  visitorId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
  conversationId: z.string().min(1).max(64).optional(),
  content: z.string().trim().min(1).max(1000),
});

export type WidgetMessageDto = z.infer<typeof WidgetMessageSchema>;
