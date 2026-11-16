import { z } from 'zod';

export const UpdateTenantSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    knowledgeBase: z.string().max(20000),
    contactInfo: z.string().max(500),
    welcomeMessage: z.string().trim().min(1).max(300),
    brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  })
  .partial();

export type UpdateTenantDto = z.infer<typeof UpdateTenantSchema>;
