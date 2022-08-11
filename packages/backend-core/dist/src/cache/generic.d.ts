export namespace CacheKeys {
    const CHECKLIST: string;
    const INSTALLATION: string;
    const ANALYTICS_ENABLED: string;
    const UNIQUE_TENANT_ID: string;
    const EVENTS: string;
    const BACKFILL_METADATA: string;
    const EVENTS_RATE_LIMIT: string;
}
export namespace TTL {
    const ONE_MINUTE: number;
    const ONE_HOUR: number;
    const ONE_DAY: number;
}
export function keys(...args: any[]): any;
export function get(...args: any[]): any;
export function store(...args: any[]): any;
declare function _delete(...args: any[]): any;
export { _delete as delete };
export function withCache(...args: any[]): any;
export function bustCache(...args: any[]): any;
