import { AppBackfillSucceededEvent, TenantBackfillSucceededEvent } from "@budibase/types";
export declare function appSucceeded(properties: AppBackfillSucceededEvent): Promise<void>;
export declare function appFailed(error: any): Promise<void>;
export declare function tenantSucceeded(properties: TenantBackfillSucceededEvent): Promise<void>;
export declare function tenantFailed(error: any): Promise<void>;
export declare function installationSucceeded(): Promise<void>;
export declare function installationFailed(error: any): Promise<void>;
