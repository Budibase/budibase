import RedisWrapper from "../../redis";
declare const _default: {
    new (client?: RedisWrapper | undefined): {
        client: RedisWrapper | undefined;
        getClient(): Promise<any>;
        keys(pattern: string): Promise<any>;
        /**
         * Read only from the cache.
         */
        get(key: string, opts?: {
            useTenancy: boolean;
        }): Promise<any>;
        /**
         * Write to the cache.
         */
        store(key: string, value: any, ttl?: number | null, opts?: {
            useTenancy: boolean;
        }): Promise<void>;
        /**
         * Remove from cache.
         */
        delete(key: string, opts?: {
            useTenancy: boolean;
        }): Promise<any>;
        /**
         * Read from the cache. Write to the cache if not exists.
         */
        withCache(key: string, ttl: number, fetchFn: any, opts?: {
            useTenancy: boolean;
        }): Promise<any>;
        bustCache(key: string, opts?: {
            client: null;
        }): Promise<void>;
    };
};
export = _default;
