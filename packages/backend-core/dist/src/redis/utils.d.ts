export namespace Databases {
    const PW_RESETS: string;
    const VERIFICATIONS: string;
    const INVITATIONS: string;
    const DEV_LOCKS: string;
    const DEBOUNCE: string;
    const SESSIONS: string;
    const USER_CACHE: string;
    const FLAGS: string;
    const APP_METADATA: string;
    const QUERY_VARS: string;
    const LICENSES: string;
    const GENERIC_CACHE: string;
    const WRITE_THROUGH: string;
}
export namespace SelectableDatabases {
    export const DEFAULT: number;
    const WRITE_THROUGH_1: number;
    export { WRITE_THROUGH_1 as WRITE_THROUGH };
    export const UNUSED_1: number;
    export const UNUSED_2: number;
    export const UNUSED_3: number;
    export const UNUSED_4: number;
    export const UNUSED_5: number;
    export const UNUSED_6: number;
    export const UNUSED_7: number;
    export const UNUSED_8: number;
    export const UNUSED_9: number;
    export const UNUSED_10: number;
    export const UNUSED_11: number;
    export const UNUSED_12: number;
    export const UNUSED_13: number;
    export const UNUSED_14: number;
}
export function getRedisOptions(clustered?: boolean): {
    opts: {
        connectTimeout: number;
    };
    host: any;
    port: any;
    redisProtocolUrl: string | undefined;
};
export function addDbPrefix(db: any, key: any): any;
export function removeDbPrefix(key: any): any;
export const SEPARATOR: "-";
