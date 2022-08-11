interface Session {
    key: string;
    userId: string;
    sessionId: string;
    lastAccessedAt: string;
    createdAt: string;
    csrfToken?: string;
    value: string;
}
export declare function getSessionsForUser(userId: string): Promise<any>;
export declare function invalidateSessions(userId: string, opts?: {
    sessionIds?: string[];
    reason?: string;
}): Promise<void>;
export declare function createASession(userId: string, session: Session): Promise<void>;
export declare function updateSessionTTL(session: Session): Promise<void>;
export declare function endSession(userId: string, sessionId: string): Promise<void>;
export declare function getSession(userId: string, sessionId: string): Promise<any>;
export {};
