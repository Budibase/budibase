import { Hosting } from "../../sdk";
export interface CreateAccount {
    email: string;
    tenantId: string;
    hosting: Hosting;
    authType: AuthType;
    registrationStep?: string;
    tenantName?: string;
    name?: string;
    size?: string;
    profession?: string;
}
export interface CreatePassswordAccount extends CreateAccount {
    password: string;
}
export declare const isCreatePasswordAccount: (account: CreateAccount) => account is CreatePassswordAccount;
export interface UpdateAccount {
    stripeCustomerId?: string;
    licenseKey?: string;
}
export interface Account extends CreateAccount {
    accountId: string;
    createdAt: number;
    verified: boolean;
    verificationSent: boolean;
    tier: string;
    stripeCustomerId?: string;
    licenseKey?: string;
}
export interface PasswordAccount extends Account {
    password: string;
}
export declare const isPasswordAccount: (account: Account) => account is PasswordAccount;
export interface CloudAccount extends Account {
    password?: string;
    budibaseUserId: string;
}
export declare const isCloudAccount: (account: Account) => account is CloudAccount;
export declare const isSelfHostAccount: (account: Account) => boolean;
export declare const isSSOAccount: (account: Account) => account is SSOAccount;
export interface SSOAccount extends Account {
    pictureUrl?: string;
    provider?: string;
    providerType?: string;
    oauth2?: OAuthTokens;
    thirdPartyProfile: any;
}
export declare enum AuthType {
    SSO = "sso",
    PASSWORD = "password"
}
export interface OAuthTokens {
    accessToken: string;
    refreshToken: string;
}
