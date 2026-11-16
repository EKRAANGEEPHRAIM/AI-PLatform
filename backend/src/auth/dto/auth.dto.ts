import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
  /** Entreprise créée avec le compte ; par défaut « Entreprise de <nom> » */
  companyName: z.string().trim().min(2).max(100).optional(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
