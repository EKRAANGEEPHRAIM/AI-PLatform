import { z } from 'zod';

export const SendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  conversationId: z.string().min(1),
});

export type SendMessageDto = z.infer<typeof SendMessageSchema>;
