import { Hosting } from "..";
export declare enum GroupType {
    TENANT = "tenant",
    INSTALLATION = "installation"
}
export interface Group {
    id: string;
    type: IdentityType;
    environment: string;
    hosting: Hosting;
}
export interface TenantGroup extends Group {
    profession?: string;
    companySize?: string;
    installationId: string;
}
export interface InstallationGroup extends Group {
    version: string;
}
export declare enum IdentityType {
    USER = "user",
    TENANT = "tenant",
    INSTALLATION = "installation"
}
export interface Identity {
    id: string;
    type: IdentityType;
    hosting: Hosting;
    environment: string;
    installationId?: string;
    tenantId?: string;
}
export interface UserIdentity extends Identity {
    verified: boolean;
    accountHolder: boolean;
    providerType?: string;
    builder?: boolean;
    admin?: boolean;
}
