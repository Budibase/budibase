import { Account, AuthType, Hosting, CloudAccount } from "@budibase/types"
import { v4 as uuid } from "uuid"
import { utils } from "@budibase/backend-core"

export const account = (): Account => {
  return {
    email: `${uuid()}@test.com`,
    tenantId: utils.newid(),
    hosting: Hosting.SELF,
    authType: AuthType.SSO,
    accountId: uuid(),
    createdAt: Date.now(),
    verified: true,
    verificationSent: true,
    tier: "FREE",
  }
}

export const cloudAccount = (): CloudAccount => {
  return {
    ...account(),
    budibaseUserId: uuid(),
  }
}
