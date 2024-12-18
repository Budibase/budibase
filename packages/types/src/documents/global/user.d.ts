import { Document } from "../document";
export interface SSOProfileJson {
    email?: string;
    picture?: string;
}
export interface OAuth2 {
    accessToken: string;
    refreshToken?: string;
}
export declare enum SSOProviderType {
    OIDC = "oidc",
    GOOGLE = "google"
}
export interface UserSSO {
    provider: string;
    providerType: SSOProviderType;
    oauth2?: OAuth2;
    profile?: {
        displayName?: string;
        name?: {
            givenName?: string;
            familyName?: string;
        };
    };
}
export type SSOUser = User & UserSSO;
export declare function isSSOUser(user: User): user is SSOUser;
export interface UserIdentifier {
    userId: string;
    email: string;
}
export interface User extends Document {
    tenantId: string;
    email: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
    forceResetPassword?: boolean;
    roles: UserRoles;
    builder?: {
        global?: boolean;
        apps?: string[];
        creator?: boolean;
    };
    admin?: {
        global: boolean;
    };
    password?: string;
    status?: UserStatus;
    createdAt?: number;
    userGroups?: string[];
    onboardedAt?: string;
    freeTrialConfirmedAt?: string;
    tours?: Record<string, Date>;
    scimInfo?: {
        isSync: true;
    } & Record<string, any>;
    appFavourites?: string[];
    ssoId?: string;
    appSort?: string;
    budibaseAccess?: boolean;
    accountPortalAccess?: boolean;
}
export interface UserBindings extends Document {
    firstName?: string;
    lastName?: string;
    email?: string;
    status?: string;
    roleId?: string | null;
    globalId?: string;
    userId?: string;
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export type UserRoles = Record<string, string>;
export interface BuilderUser extends User {
    builder: {
        global?: boolean;
        apps?: string[];
    };
}
export interface AdminUser extends User {
    admin: {
        global: boolean;
    };
    builder: {
        global: boolean;
    };
}
export interface AdminOnlyUser extends User {
    admin: {
        global: boolean;
    };
}
export declare function isUser(user: object): user is User;
