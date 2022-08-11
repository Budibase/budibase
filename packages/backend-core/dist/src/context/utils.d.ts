import { IdentityContext } from "@budibase/types";
export declare function updateUsing(usingKey: string, existing: boolean, internal: (opts: {
    existing: boolean;
}) => Promise<any>): Promise<any>;
export declare function closeWithUsing(usingKey: string, closeFn: () => Promise<any>): Promise<void>;
export declare const setAppTenantId: (appId: string) => void;
export declare const setIdentity: (identity: IdentityContext | null) => void;
export declare function closeAppDBs(): Promise<void>;
export declare function getContextDB(key: string, opts: any): any;
