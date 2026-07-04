"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConversationSchema = exports.CreateConversationSchema = void 0;
const zod_1 = require("zod");
exports.CreateConversationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
});
exports.UpdateConversationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    status: zod_1.z.enum(['ACTIVE', 'ARCHIVED', 'RESOLVED']).optional(),
});
//# sourceMappingURL=conversation.dto.js.map