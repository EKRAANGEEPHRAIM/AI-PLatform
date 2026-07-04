"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageSchema = void 0;
const zod_1 = require("zod");
exports.SendMessageSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(5000),
    conversationId: zod_1.z.string().min(1),
});
//# sourceMappingURL=chat.dto.js.map