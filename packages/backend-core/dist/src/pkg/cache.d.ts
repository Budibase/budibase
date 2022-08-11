import * as user from "../cache/user";
import * as app from "../cache/appMetadata";
declare const _default: {
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
    app: typeof app;
    user: typeof user;
};
export = _default;
