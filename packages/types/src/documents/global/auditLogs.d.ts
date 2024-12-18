import { Document } from "../document";
import { Event } from "../../sdk";
export declare const AuditLogSystemUser = "SYSTEM";
export declare const AUDIT_LOG_TYPE = "auditLog";
export type FallbackInfo = {
    appName?: string;
    email?: string;
};
export interface AuditLogDoc extends Document {
    appId?: string;
    event: Event;
    userId: string;
    timestamp: string;
    metadata: any;
    name: string;
    type?: "auditLog";
    fallback?: FallbackInfo;
}
