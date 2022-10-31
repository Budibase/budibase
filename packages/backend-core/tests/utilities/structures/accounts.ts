import { generator, uuid } from "."
import { AuthType, CloudAccount, Hosting } from "@budibase/types"
import * as db from "../../../src/db/utils"

export const cloudAccount = (): CloudAccount => {
  return {
    accountId: uuid(),
    createdAt: Date.now(),
    verified: true,
    verificationSent: true,
    tier: "",
    email: generator.email(),
    tenantId: generator.word(),
    hosting: Hosting.CLOUD,
    authType: AuthType.PASSWORD,
    password: generator.word(),
    tenantName: generator.word(),
    name: generator.name(),
    size: "10+",
    profession: "Software Engineer",
    budibaseUserId: db.generateGlobalUserID(),
  }
}
