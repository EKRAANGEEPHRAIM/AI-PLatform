"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.8.0",
    "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
    "activeProvider": "postgresql",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel User {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  password  String\n  name      String\n  role      Role     @default(USER)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  conversations Conversation[]\n\n  @@map(\"users\")\n}\n\nmodel Conversation {\n  id        String             @id @default(cuid())\n  title     String\n  status    ConversationStatus @default(ACTIVE)\n  createdAt DateTime           @default(now())\n  updatedAt DateTime           @updatedAt\n\n  userId   String\n  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  messages Message[]\n\n  @@map(\"conversations\")\n}\n\nmodel Message {\n  id        String      @id @default(cuid())\n  content   String\n  role      MessageRole\n  createdAt DateTime    @default(now())\n\n  conversationId String\n  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)\n\n  @@map(\"messages\")\n}\n\nenum Role {\n  USER\n  ADMIN\n}\n\nenum ConversationStatus {\n  ACTIVE\n  ARCHIVED\n  RESOLVED\n}\n\nenum MessageRole {\n  USER\n  ASSISTANT\n  SYSTEM\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"conversations\",\"kind\":\"object\",\"type\":\"Conversation\",\"relationName\":\"ConversationToUser\"}],\"dbName\":\"users\"},\"Conversation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"ConversationStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ConversationToUser\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"ConversationToMessage\"}],\"dbName\":\"conversations\"},\"Message\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"MessageRole\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"conversationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"conversation\",\"kind\":\"object\",\"type\":\"Conversation\",\"relationName\":\"ConversationToMessage\"}],\"dbName\":\"messages\"}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"user\",\"conversation\",\"messages\",\"_count\",\"conversations\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"Conversation.findUnique\",\"Conversation.findUniqueOrThrow\",\"Conversation.findFirst\",\"Conversation.findFirstOrThrow\",\"Conversation.findMany\",\"Conversation.createOne\",\"Conversation.createMany\",\"Conversation.createManyAndReturn\",\"Conversation.updateOne\",\"Conversation.updateMany\",\"Conversation.updateManyAndReturn\",\"Conversation.upsertOne\",\"Conversation.deleteOne\",\"Conversation.deleteMany\",\"Conversation.groupBy\",\"Conversation.aggregate\",\"Message.findUnique\",\"Message.findUniqueOrThrow\",\"Message.findFirst\",\"Message.findFirstOrThrow\",\"Message.findMany\",\"Message.createOne\",\"Message.createMany\",\"Message.createManyAndReturn\",\"Message.updateOne\",\"Message.updateMany\",\"Message.updateManyAndReturn\",\"Message.upsertOne\",\"Message.deleteOne\",\"Message.deleteMany\",\"Message.groupBy\",\"Message.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"content\",\"MessageRole\",\"role\",\"createdAt\",\"conversationId\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"title\",\"ConversationStatus\",\"status\",\"updatedAt\",\"userId\",\"email\",\"password\",\"name\",\"Role\",\"every\",\"some\",\"none\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\"]"),
    graph: "rAEbMAsHAABnACA-AABjADA_AAAOABBAAABjADBBAQAAAAFEAABlWyJFQABmACFVQABmACFXAQAAAAFYAQBkACFZAQBkACEBAAAAAQAgCwMAAG0AIAUAAG4AID4AAGsAMD8AAAMAEEAAAGsAMEEBAGQAIUVAAGYAIVIBAGQAIVQAAGxUIlVAAGYAIVYBAGQAIQIDAACfAQAgBQAAoAEAIAsDAABtACAFAABuACA-AABrADA_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-AABjADA_AAAOABBAAABjADBBAQBkACFEAABlWyJFQABmACFVQABmACFXAQBkACFYAQBkACFZAQBkACELRwEAAAABSAEAAAAESQEAAAAESgEAAAABSwEAAAABTAEAAAABTQEAAAABTgEAWgAhTwEAAAABUAEAAAABUQEAAAABBEcAAABbAkgAAABbCEkAAABbCE4AAGJbIghHQAAAAAFIQAAAAARJQAAAAARKQAAAAAFLQAAAAAFMQAAAAAFNQAAAAAFOQABWACEDWwAAAwAgXAAAAwAgXQAAAwAgCQQAAGoAID4AAGgAMD8AAAcAEEAAAGgAMEEBAGQAIUIBAGQAIUQAAGlEIkVAAGYAIUYBAGQAIQRHAAAARAJIAAAARAhJAAAARAhOAABYRCINAwAAbQAgBQAAbgAgPgAAawAwPwAAAwAQQAAAawAwQQEAZAAhRUAAZgAhUgEAZAAhVAAAbFQiVUAAZgAhVgEAZAAhXgAAAwAgXwAAAwAgCwMAAG0AIAUAAG4AID4AAGsAMD8AAAMAEEAAAGsAMEEBAGQAIUVAAGYAIVIBAGQAIVQAAGxUIlVAAGYAIVYBAGQAIQRHAAAAVAJIAAAAVAhJAAAAVAhOAABeVCINBwAAZwAgPgAAYwAwPwAADgAQQAAAYwAwQQEAZAAhRAAAZVsiRUAAZgAhVUAAZgAhVwEAZAAhWAEAZAAhWQEAZAAhXgAADgAgXwAADgAgA1sAAAcAIFwAAAcAIF0AAAcAIAAAAAFjAQAAAAEBYwAAAEQCAWNAAAAAAQUUAACoAQAgFQAAqwEAIGAAAKkBACBhAACqAQAgZgAABQAgAxQAAKgBACBgAACpAQAgZgAABQAgAAAAAWMAAABUAgUUAACiAQAgFQAApgEAIGAAAKMBACBhAAClAQAgZgAAAQAgCxQAAH0AMBUAAIIBADBgAAB-ADBhAAB_ADBiAACAAQAgYwAAgQEAMGQAAIEBADBlAACBAQAwZgAAgQEAMGcAAIMBADBoAACEAQAwBEEBAAAAAUIBAAAAAUQAAABEAkVAAAAAAQIAAAAJACAUAACIAQAgAwAAAAkAIBQAAIgBACAVAACHAQAgAQ0AAKQBADAJBAAAagAgPgAAaAAwPwAABwAQQAAAaAAwQQEAAAABQgEAZAAhRAAAaUQiRUAAZgAhRgEAZAAhAgAAAAkAIA0AAIcBACACAAAAhQEAIA0AAIYBACAIPgAAhAEAMD8AAIUBABBAAACEAQAwQQEAZAAhQgEAZAAhRAAAaUQiRUAAZgAhRgEAZAAhCD4AAIQBADA_AACFAQAQQAAAhAEAMEEBAGQAIUIBAGQAIUQAAGlEIkVAAGYAIUYBAGQAIQRBAQByACFCAQByACFEAABzRCJFQAB0ACEEQQEAcgAhQgEAcgAhRAAAc0QiRUAAdAAhBEEBAAAAAUIBAAAAAUQAAABEAkVAAAAAAQMUAACiAQAgYAAAowEAIGYAAAEAIAQUAAB9ADBgAAB-ADBiAACAAQAgZgAAgQEAMAAAAAFjAAAAWwILFAAAkAEAMBUAAJUBADBgAACRAQAwYQAAkgEAMGIAAJMBACBjAACUAQAwZAAAlAEAMGUAAJQBADBmAACUAQAwZwAAlgEAMGgAAJcBADAGBQAAigEAIEEBAAAAAUVAAAAAAVIBAAAAAVQAAABUAlVAAAAAAQIAAAAFACAUAACbAQAgAwAAAAUAIBQAAJsBACAVAACaAQAgAQ0AAKEBADALAwAAbQAgBQAAbgAgPgAAawAwPwAAAwAQQAAAawAwQQEAAAABRUAAZgAhUgEAZAAhVAAAbFQiVUAAZgAhVgEAZAAhAgAAAAUAIA0AAJoBACACAAAAmAEAIA0AAJkBACAJPgAAlwEAMD8AAJgBABBAAACXAQAwQQEAZAAhRUAAZgAhUgEAZAAhVAAAbFQiVUAAZgAhVgEAZAAhCT4AAJcBADA_AACYAQAQQAAAlwEAMEEBAGQAIUVAAGYAIVIBAGQAIVQAAGxUIlVAAGYAIVYBAGQAIQVBAQByACFFQAB0ACFSAQByACFUAAB6VCJVQAB0ACEGBQAAfAAgQQEAcgAhRUAAdAAhUgEAcgAhVAAAelQiVUAAdAAhBgUAAIoBACBBAQAAAAFFQAAAAAFSAQAAAAFUAAAAVAJVQAAAAAEEFAAAkAEAMGAAAJEBADBiAACTAQAgZgAAlAEAMAACAwAAnwEAIAUAAKABACABBwAAnQEAIAAFQQEAAAABRUAAAAABUgEAAAABVAAAAFQCVUAAAAABB0EBAAAAAUQAAABbAkVAAAAAAVVAAAAAAVcBAAAAAVgBAAAAAVkBAAAAAQIAAAABACAUAACiAQAgBEEBAAAAAUIBAAAAAUQAAABEAkVAAAAAAQMAAAAOACAUAACiAQAgFQAApwEAIAkAAAAOACANAACnAQAgQQEAcgAhRAAAjgFbIkVAAHQAIVVAAHQAIVcBAHIAIVgBAHIAIVkBAHIAIQdBAQByACFEAACOAVsiRUAAdAAhVUAAdAAhVwEAcgAhWAEAcgAhWQEAcgAhBwMAAIkBACBBAQAAAAFFQAAAAAFSAQAAAAFUAAAAVAJVQAAAAAFWAQAAAAECAAAABQAgFAAAqAEAIAMAAAADACAUAACoAQAgFQAArAEAIAkAAAADACADAAB7ACANAACsAQAgQQEAcgAhRUAAdAAhUgEAcgAhVAAAelQiVUAAdAAhVgEAcgAhBwMAAHsAIEEBAHIAIUVAAHQAIVIBAHIAIVQAAHpUIlVAAHQAIVYBAHIAIQIGAAUHBgIDAwABBQoDBgAEAQQAAgEFCwABBwwAAAAAAwYAChoACxsADAAAAAMGAAoaAAsbAAwBAwABAQMAAQMGABEaABIbABMAAAADBgARGgASGwATAQQAAgEEAAIDBgAYGgAZGwAaAAAAAwYAGBoAGRsAGggCAQkNAQoQAQsRAQwSAQ4UAQ8WBhAXBxEZARIbBhMcCBYdARceARgfBhwiCR0jDR4kAh8lAiAmAiEnAiIoAiMqAiQsBiUtDiYvAicxBigyDykzAio0Ais1Biw4EC05FC46Ay87AzA8AzE9AzI-AzNAAzRCBjVDFTZFAzdHBjhIFjlJAzpKAztLBjxOFz1PGw"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map