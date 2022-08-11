import { CloudAccount } from "@budibase/types";
export declare const getAccount: (email: string) => Promise<CloudAccount | undefined>;
export declare const getAccountByTenantId: (tenantId: string) => Promise<CloudAccount | undefined>;
export declare const getStatus: () => Promise<any>;
