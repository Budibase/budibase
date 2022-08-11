import { IdentityContext } from "@budibase/types";
export declare const DEFAULT_TENANT_ID: "default";
export declare const closeTenancy: () => Promise<void>;
export declare const isMultiTenant: () => string | undefined;
/**
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
export declare const getTenantIDFromAppID: (appId: string) => string | null;
export declare const doInTenant: (tenantId: string | null, task: any) => Promise<any>;
export declare const doInAppContext: (appId: string, task: any) => Promise<any>;
export declare const doInIdentityContext: (identity: IdentityContext, task: any) => Promise<any>;
export declare const getIdentity: () => IdentityContext | undefined;
export declare const updateTenantId: (tenantId: string | null) => void;
export declare const updateAppId: (appId: string) => Promise<void>;
export declare const setGlobalDB: (tenantId: string | null) => any;
export declare const getGlobalDB: () => any;
export declare const isTenantIdSet: () => boolean;
export declare const getTenantId: () => any;
export declare const getAppId: () => any;
/**
 * Opens the app database based on whatever the request
 * contained, dev or prod.
 */
export declare const getAppDB: (opts?: any) => any;
/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will open the prod one.
 */
export declare const getProdAppDB: (opts?: any) => any;
/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will open the dev one.
 */
export declare const getDevAppDB: (opts?: any) => any;
