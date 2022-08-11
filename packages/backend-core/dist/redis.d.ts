export const Client: {
    new (db: string, selectDb?: number | null): {
        _db: string;
        _select: number;
        getClient(): any;
        init(): Promise<any>;
        finish(): Promise<void>;
        scan(key?: string): Promise<any>;
        keys(pattern: string): Promise<any>;
        get(key: string): Promise<any>;
        store(key: string, value: any, expirySeconds?: number | null): Promise<void>;
        getTTL(key: string): Promise<any>;
        setExpiry(key: string, expirySeconds: number | null): Promise<void>;
        delete(key: string): Promise<void>;
        clear(): Promise<void>;
    };
};
export const utils: typeof import("./src/redis/utils");
export const clients: {
    getUserClient: () => Promise<any>;
    getSessionClient: () => Promise<any>;
    getAppClient: () => Promise<any>;
    getCacheClient: () => Promise<any>;
    getWritethroughClient: () => Promise<any>;
    getMigrationsRedlock: () => Promise<any>;
};
