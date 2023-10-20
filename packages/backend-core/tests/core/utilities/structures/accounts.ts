import { generator, quotas, uuid } from "."
import { generateGlobalUserID } from "../../../../src/docIds"
import {
  Account,
  AccountSSOProvider,
  AccountSSOProviderType,
  AuthType,
  CloudAccount,
  CreateAccount,
  CreatePassswordAccount,
  CreateVerifiableSSOAccount,
  Hosting,
  SSOAccount,
} from "@budibase/types"
import sample from "lodash/sample"

export const account = (partial: Partial<Account> = {}): Account => {
  return {
    accountId: uuid(),
    tenantId: generator.word(),
    email: generator.email(),
    tenantName: generator.word(),
    hosting: Hosting.SELF,
    createdAt: Date.now(),
    verified: true,
    verificationSent: true,
    tier: "FREE", // DEPRECATED
    authType: AuthType.PASSWORD,
    name: generator.name(),
    size: "10+",
    profession: "Software Engineer",
    quotaUsage: quotas.usage(),
    ...partial,
  }
}

export function selfHostAccount() {
  return account()
}

export const cloudAccount = (): CloudAccount => {
  return {
    ...account(),
    hosting: Hosting.CLOUD,
    budibaseUserId: generateGlobalUserID(),
  }
}

function providerType(): AccountSSOProviderType {
  return sample(Object.values(AccountSSOProviderType)) as AccountSSOProviderType
}

function provider(): AccountSSOProvider {
  return sample(Object.values(AccountSSOProvider)) as AccountSSOProvider
}

export function ssoAccount(account: Account = cloudAccount()): SSOAccount {
  return {
    ...account,
    authType: AuthType.SSO,
    oauth2: {
      accessToken: generator.string(),
      refreshToken: generator.string(),
    },
    pictureUrl: generator.url(),
    provider: provider(),
    providerType: providerType(),
    thirdPartyProfile: {},
  }
}

export function verifiableSsoAccount(
  account: Account = cloudAccount()
): SSOAccount {
  return {
    ...account,
    authType: AuthType.SSO,
    oauth2: {
      accessToken: generator.string(),
      refreshToken: generator.string(),
    },
    pictureUrl: generator.url(),
    provider: AccountSSOProvider.MICROSOFT,
    providerType: AccountSSOProviderType.MICROSOFT,
    thirdPartyProfile: { id: "abc123" },
  }
}

export const cloudCreateAccount: CreatePassswordAccount = {
  email: "cloud@budibase.com",
  tenantId: "cloud",
  hosting: Hosting.CLOUD,
  authType: AuthType.PASSWORD,
  password: "Password123!",
  tenantName: "cloud",
  name: "Budi Armstrong",
  size: "10+",
  profession: "Software Engineer",
}

export const cloudSSOCreateAccount: CreateAccount = {
  email: "cloud-sso@budibase.com",
  tenantId: "cloud-sso",
  hosting: Hosting.CLOUD,
  authType: AuthType.SSO,
  tenantName: "cloudsso",
  name: "Budi Armstrong",
  size: "10+",
  profession: "Software Engineer",
}

export const cloudVerifiableSSOCreateAccount: CreateVerifiableSSOAccount = {
  email: "cloud-sso@budibase.com",
  tenantId: "cloud-sso",
  hosting: Hosting.CLOUD,
  authType: AuthType.SSO,
  tenantName: "cloudsso",
  name: "Budi Armstrong",
  size: "10+",
  profession: "Software Engineer",
  provider: AccountSSOProvider.MICROSOFT,
  thirdPartyProfile: { id: "abc123" },
}

export const selfCreateAccount: CreatePassswordAccount = {
  email: "self@budibase.com",
  tenantId: "self",
  hosting: Hosting.SELF,
  authType: AuthType.PASSWORD,
  password: "Password123!",
  tenantName: "self",
  name: "Budi Armstrong",
  size: "10+",
  profession: "Software Engineer",
}

export const selfSSOCreateAccount: CreateAccount = {
  email: "self-sso@budibase.com",
  tenantId: "self-sso",
  hosting: Hosting.SELF,
  authType: AuthType.SSO,
  tenantName: "selfsso",
  name: "Budi Armstrong",
  size: "10+",
  profession: "Software Engineer",
}
