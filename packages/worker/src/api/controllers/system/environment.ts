import { Ctx } from "@budibase/types"
import env from "../../../environment"
import { env as coreEnv } from "@budibase/backend-core"
import nodeFetch from "node-fetch"

let sqsAvailable: boolean
async function isSqsAvailable() {
  if (sqsAvailable !== undefined) {
    return sqsAvailable
  }

  try {
    await nodeFetch(coreEnv.COUCH_DB_SQL_URL, {
      timeout: 1000,
    })
    sqsAvailable = true
    return true
  } catch (e) {
    sqsAvailable = false
    return false
  }
}

export const fetch = async (ctx: Ctx) => {
  ctx.body = {
    multiTenancy: !!env.MULTI_TENANCY,
    offlineMode: !!coreEnv.OFFLINE_MODE,
    cloud: !env.SELF_HOSTED,
    accountPortalUrl: env.ACCOUNT_PORTAL_URL,
    disableAccountPortal: env.DISABLE_ACCOUNT_PORTAL,
    baseUrl: env.PLATFORM_URL,
    isDev: env.isDev() && !env.isTest(),
  }

  if (env.SELF_HOSTED) {
    ctx.body.infrastructure = {
      sqs: await isSqsAvailable(),
    }
  }
}
