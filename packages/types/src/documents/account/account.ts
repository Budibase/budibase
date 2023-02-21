import {
  Feature,
  Hosting,
  License,
  MonthlyQuotaName,
  PlanType,
  PriceDuration,
  Quotas,
  StaticQuotaName,
} from "../../sdk"
import { MonthlyUsage, QuotaUsage, StaticUsage } from "../global"

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

export const isCreatePasswordAccount = (
  account: CreateAccount
): account is CreatePassswordAccount => account.authType === AuthType.PASSWORD

export interface LicenseOverrides {
  features?: Feature[]
  quotas?: Quotas
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
  planTier?: number
  license?: License
  stripeCustomerId?: string
  licenseKey?: string
  licenseKeyActivatedAt?: number
  licenseOverrides?: LicenseOverrides
  quotaUsage?: QuotaUsage
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
}

export enum AccountSSOProvider {
  GOOGLE = "google",
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
