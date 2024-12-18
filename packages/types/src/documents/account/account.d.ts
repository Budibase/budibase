import { Feature, Hosting, License, PlanType, Quotas } from "../../sdk";
import { DeepPartial } from "../../shared";
import { QuotaUsage } from "../global";
export interface CreateAccount {
    email: string;
    tenantId: string;
    hosting: Hosting;
    authType: AuthType;
    accountName: string;
    registrationStep?: string;
    name?: string;
    size?: string;
    profession?: string;
}
export interface CreatePassswordAccount extends CreateAccount {
    password: string;
}
export declare const isCreatePasswordAccount: (account: CreateAccount) => account is CreatePassswordAccount;
export interface LicenseOverrides {
    features?: Feature[];
    quotas?: DeepPartial<Quotas>;
}
export interface Account extends CreateAccount {
    accountId: string;
    createdAt: number;
    verified: boolean;
    verificationSent: boolean;
    planType?: PlanType;
    license?: License;
    installId?: string;
    installTenantId?: string;
    installVersion?: string;
    stripeCustomerId?: string;
    licenseKey?: string;
    licenseKeyActivatedAt?: number;
    licenseRequestedAt?: number;
    licenseOverrides?: LicenseOverrides;
    provider?: AccountSSOProvider;
    providerType?: AccountSSOProviderType;
    quotaUsage?: QuotaUsage;
    offlineLicenseToken?: string;
    tenantName?: string;
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
export declare enum AccountSSOProviderType {
    GOOGLE = "google",
    MICROSOFT = "microsoft"
}
export declare enum AccountSSOProvider {
    GOOGLE = "google",
    MICROSOFT = "microsoft"
}
export declare function isVerifiableSSOProvider(provider: AccountSSOProvider): boolean;
export interface AccountSSO {
    ssoId?: string;
    provider: AccountSSOProvider;
    providerType: AccountSSOProviderType;
    oauth2?: OAuthTokens;
}
export type SSOAccount = (Account | CloudAccount) & AccountSSO;
export declare enum AuthType {
    SSO = "sso",
    PASSWORD = "password"
}
export interface OAuthTokens {
    accessToken: string;
    refreshToken: string;
}
