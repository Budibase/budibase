import { generator, uuid } from "."
import * as db from "../../../src/db/utils"
import {
  Account,
  AccountSSOProvider,
  AccountSSOProviderType,
  AuthType,
  CloudAccount,
  Hosting,
  SSOAccount,
} from "@budibase/types"
import _ from "lodash"

export const account = (): Account => {
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
  }
}

export const cloudAccount = (): CloudAccount => {
  return {
    ...account(),
    hosting: Hosting.CLOUD,
    budibaseUserId: db.generateGlobalUserID(),
  }
}

function providerType(): AccountSSOProviderType {
  return _.sample(
    Object.values(AccountSSOProviderType)
  ) as AccountSSOProviderType
}

function provider(): AccountSSOProvider {
  return _.sample(Object.values(AccountSSOProvider)) as AccountSSOProvider
}

export function ssoAccount(): SSOAccount {
  return {
    ...cloudAccount(),
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
