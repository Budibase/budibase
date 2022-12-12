declare class RedisWrapper {
    _db: string;
    _select: number;
    constructor(db: string, selectDb?: number | null);
    getClient(): any;
    init(): Promise<this>;
    finish(): Promise<void>;
    scan(key?: string): Promise<any>;
    keys(pattern: string): Promise<any>;
    get(key: string): Promise<any>;
    bulkGet(keys: string[]): Promise<any>;
    store(key: string, value: any, expirySeconds?: number | null): Promise<void>;
    getTTL(key: string): Promise<any>;
    setExpiry(key: string, expirySeconds: number | null): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}
export = RedisWrapper;
