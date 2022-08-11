declare const _exports: {
    cache: typeof generic;
    CacheKeys: {
        CHECKLIST: string;
        INSTALLATION: string;
        ANALYTICS_ENABLED: string;
        UNIQUE_TENANT_ID: string;
        EVENTS: string;
        BACKFILL_METADATA: string;
        EVENTS_RATE_LIMIT: string;
    };
    TTL: {
        ONE_MINUTE: number;
        ONE_HOUR: number;
        ONE_DAY: number;
    };
    keys: (...args: any[]) => any;
    get: (...args: any[]) => any;
    store: (...args: any[]) => any;
    delete: (...args: any[]) => any;
    withCache: (...args: any[]) => any;
    bustCache: (...args: any[]) => any;
    user: typeof import("./src/cache/user");
    app: typeof import("./src/cache/appMetadata");
    writethrough: typeof import("./src/cache/writethrough");
};
export = _exports;
import generic = require("./src/cache/generic");
