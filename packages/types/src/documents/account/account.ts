import { Feature, Hosting, License, PlanType, Quotas } from "../../sdk"
import { DeepPartial } from "../../shared"
import { QuotaUsage } from "../global"

export interface CreateAccount {
  email: string
  tenantId: string
  hosting: Hosting
  authType: AuthType
  // optional fields - for sso based sign ups
  registrationStep?: string
  // profile
  tenantName?: string
  name?: string
  size?: string
  profession?: string
}

export interface CreatePassswordAccount extends CreateAccount {
  password: string
}

export interface CreateVerifiableSSOAccount extends CreateAccount {
  provider?: AccountSSOProvider
  thirdPartyProfile?: any
}

export const isCreatePasswordAccount = (
  account: CreateAccount
): account is CreatePassswordAccount => account.authType === AuthType.PASSWORD

export interface LicenseOverrides {
  features?: Feature[]
  quotas?: DeepPartial<Quotas>
}

export interface Account extends CreateAccount {
  // generated
  accountId: string
  createdAt: number
  // registration
  verified: boolean
  verificationSent: boolean
  // licensing
  tier: string // deprecated
  planType?: PlanType
  /** @deprecated */
  planTier?: number
  license?: License
  installId?: string
  installTenantId?: string
  installVersion?: string
  stripeCustomerId?: string
  licenseKey?: string
  licenseKeyActivatedAt?: number
  licenseRequestedAt?: number
  licenseOverrides?: LicenseOverrides
  provider?: AccountSSOProvider
  providerType?: AccountSSOProviderType
  quotaUsage?: QuotaUsage
  offlineLicenseToken?: string
}

export interface PasswordAccount extends Account {
  password: string
}

export const isPasswordAccount = (
  account: Account
): account is PasswordAccount =>
  account.authType === AuthType.PASSWORD && account.hosting === Hosting.SELF

export interface CloudAccount extends Account {
  password?: string
  budibaseUserId: string
}

export const isCloudAccount = (account: Account): account is CloudAccount =>
  account.hosting === Hosting.CLOUD

export const isSelfHostAccount = (account: Account) =>
  account.hosting === Hosting.SELF

export const isSSOAccount = (account: Account): account is SSOAccount =>
  account.authType === AuthType.SSO

export enum AccountSSOProviderType {
  GOOGLE = "google",
  MICROSOFT = "microsoft",
}

export enum AccountSSOProvider {
  GOOGLE = "google",
  MICROSOFT = "microsoft",
}

const verifiableSSOProviders: AccountSSOProvider[] = [
  AccountSSOProvider.MICROSOFT,
]
export function isVerifiableSSOProvider(provider: AccountSSOProvider): boolean {
  return verifiableSSOProviders.includes(provider)
}

export interface AccountSSO {
  provider: AccountSSOProvider
  providerType: AccountSSOProviderType
  oauth2?: OAuthTokens
  pictureUrl?: string
  thirdPartyProfile: any // TODO: define what the google profile looks like
}

export type SSOAccount = (Account | CloudAccount) & AccountSSO

export enum AuthType {
  SSO = "sso",
  PASSWORD = "password",
}

export interface OAuthTokens {
  accessToken: string
  refreshToken: string
}
