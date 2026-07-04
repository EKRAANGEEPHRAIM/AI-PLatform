import { z } from 'zod';
export declare const CreateConversationSchema: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strip>;
export declare const UpdateConversationSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        ARCHIVED: "ARCHIVED";
        RESOLVED: "RESOLVED";
    }>>;
}, z.core.$strip>;
export type CreateConversationDto = z.infer<typeof CreateConversationSchema>;
export type UpdateConversationDto = z.infer<typeof UpdateConversationSchema>;
