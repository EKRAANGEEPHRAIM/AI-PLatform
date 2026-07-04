export declare const Role: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const ConversationStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
    readonly RESOLVED: "RESOLVED";
};
export type ConversationStatus = (typeof ConversationStatus)[keyof typeof ConversationStatus];
export declare const MessageRole: {
    readonly USER: "USER";
    readonly ASSISTANT: "ASSISTANT";
    readonly SYSTEM: "SYSTEM";
};
export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];
