import { z } from 'zod';

export const CreateConversationSchema = z.object({
  title: z.string().min(1).max(200),
});

export const UpdateConversationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'RESOLVED']).optional(),
});

export type CreateConversationDto = z.infer<typeof CreateConversationSchema>;
export type UpdateConversationDto = z.infer<typeof UpdateConversationSchema>;
