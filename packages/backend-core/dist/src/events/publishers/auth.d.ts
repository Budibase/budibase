import { LoginSource, SSOType } from "@budibase/types";
export declare function login(source: LoginSource): Promise<void>;
export declare function logout(): Promise<void>;
export declare function SSOCreated(type: SSOType, timestamp?: string | number): Promise<void>;
export declare function SSOUpdated(type: SSOType): Promise<void>;
export declare function SSOActivated(type: SSOType, timestamp?: string | number): Promise<void>;
export declare function SSODeactivated(type: SSOType): Promise<void>;
