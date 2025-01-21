import { generator, quotas, uuid } from "."
import { generateGlobalUserID } from "../../../../src/docIds"
import {
  Account,
  AccountSSOProvider,
  AccountSSOProviderType,
  AuthType,
  CloudAccount,
  Hosting,
  SSOAccount,
} from "@budibase/types"
import sample from "lodash/sample"

export const account = (partial: Partial<Account> = {}): Account => {
  return {
    accountId: uuid(),
    tenantId: generator.word(),
    email: generator.email({ domain: "example.com" }),
    accountName: generator.word(),
    tenantName: generator.word(),
    hosting: Hosting.SELF,
    createdAt: Date.now(),
    verified: true,
    verificationSent: true,
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
    provider: provider(),
    providerType: providerType(),
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
    provider: AccountSSOProvider.MICROSOFT,
    providerType: AccountSSOProviderType.MICROSOFT,
  }
}
