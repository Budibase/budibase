import * as identity from "../context/identity";
declare const _default: {
    getAppDB: (opts?: any) => any;
    getDevAppDB: (opts?: any) => any;
    getProdAppDB: (opts?: any) => any;
    getAppId: () => any;
    updateAppId: (appId: string) => Promise<void>;
    doInAppContext: (appId: string, task: any) => Promise<any>;
    doInTenant: (tenantId: string | null, task: any) => Promise<any>;
    identity: typeof identity;
};
export = _default;
