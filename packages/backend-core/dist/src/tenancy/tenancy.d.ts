export declare const addTenantToUrl: (url: string) => string;
export declare const doesTenantExist: (tenantId: string) => Promise<any>;
export declare const tryAddTenant: (tenantId: string, userId: string, email: string, afterCreateTenant: () => Promise<void>) => Promise<any>;
export declare const getGlobalDBName: (tenantId?: string) => string;
export declare const doWithGlobalDB: (tenantId: string, cb: any) => Promise<any>;
export declare const lookupTenantId: (userId: string) => Promise<any>;
export declare const getTenantUser: (identifier: string) => Promise<any>;
export declare const isUserInAppTenant: (appId: string, user: any) => boolean;
export declare const getTenantIds: () => Promise<any>;
