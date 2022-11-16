import { generator, uuid } from "."
import * as db from "../../../src/db/utils"
import { Account, AuthType, CloudAccount, Hosting } from "@budibase/types"

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
