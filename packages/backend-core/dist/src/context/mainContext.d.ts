import { Database, IdentityContext } from "@budibase/types";
export declare type ContextMap = {
    tenantId?: string;
    appId?: string;
    identity?: IdentityContext;
};
export declare function getGlobalDBName(tenantId?: string): string;
export declare function baseGlobalDBName(tenantId: string | undefined | null): string;
export declare function isMultiTenant(): string | undefined;
export declare function isTenantIdSet(): boolean;
export declare function isTenancyEnabled(): string | undefined;
/**
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
export declare function getTenantIDFromAppID(appId: string): string | undefined;
export declare function doInContext(appId: string, task: any): Promise<any>;
export declare function doInTenant(tenantId: string | null, task: any): Promise<any>;
export declare function doInAppContext(appId: string, task: any): Promise<any>;
export declare function doInIdentityContext(identity: IdentityContext, task: any): Promise<any>;
export declare function getIdentity(): IdentityContext | undefined;
export declare function getTenantId(): string;
export declare function getAppId(): string | undefined;
export declare function updateTenantId(tenantId?: string): void;
export declare function updateAppId(appId: string): void;
export declare function getGlobalDB(): Database;
/**
 * Gets the app database based on whatever the request
 * contained, dev or prod.
 */
export declare function getAppDB(opts?: any): Database;
/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will get the prod one.
 */
export declare function getProdAppDB(opts?: any): Database;
/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will get the dev one.
 */
export declare function getDevAppDB(opts?: any): Database;
