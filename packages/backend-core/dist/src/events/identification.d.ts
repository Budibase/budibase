import { User, Identity, Account, CloudAccount, Group } from "@budibase/types";
/**
 * An identity can be:
 * - account user (Self host)
 * - budibase user
 * - tenant
 * - installation
 */
export declare const getCurrentIdentity: () => Promise<Identity>;
export declare const identifyInstallationGroup: (installId: string, timestamp?: string | number) => Promise<void>;
export declare const identifyTenantGroup: (tenantId: string, account: Account | undefined, timestamp?: string | number) => Promise<void>;
export declare const identifyUser: (user: User, account: CloudAccount | undefined, timestamp?: string | number) => Promise<void>;
export declare const identifyAccount: (account: Account) => Promise<void>;
export declare const identify: (identity: Identity, timestamp?: string | number) => Promise<void>;
export declare const identifyGroup: (group: Group, timestamp?: string | number) => Promise<void>;
export declare const getInstallationId: () => Promise<string>;
