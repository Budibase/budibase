import { Ctx, GetEnvironmentResponse, MaintenanceType } from "@budibase/types"
import env from "../../../environment"
import { env as coreEnv, db as dbCore } from "@budibase/backend-core"
import nodeFetch from "node-fetch"
import { helpers } from "@budibase/shared-core"

let sqsAvailable: boolean
async function isSqsAvailable() {
  // We cache this value for the duration of the Node process because we don't
  // want every page load to be making this relatively expensive check.
  if (sqsAvailable !== undefined) {
    return sqsAvailable
  }

  try {
    const { url } = dbCore.getCouchInfo()
    if (!url) {
      sqsAvailable = false
      return false
    }
    await helpers.retry(
      async () => {
        await nodeFetch(url, { timeout: 2000 })
      },
      { times: 3 }
    )
    console.log("connected to SQS")
    sqsAvailable = true
    return true
  } catch (e) {
    console.warn("failed to connect to SQS", e)
    sqsAvailable = false
    return false
  }
}

async function isSqsMissing() {
  return !(await isSqsAvailable())
}

export const fetch = async (ctx: Ctx<void, GetEnvironmentResponse>) => {
  ctx.body = {
    multiTenancy: !!env.MULTI_TENANCY,
    offlineMode: !!coreEnv.OFFLINE_MODE,
    cloud: !env.SELF_HOSTED,
    accountPortalUrl: env.ACCOUNT_PORTAL_URL,
    disableAccountPortal: !!env.DISABLE_ACCOUNT_PORTAL,
    baseUrl: env.PLATFORM_URL,
    isDev: env.isDev() && !env.isTest(),
    maintenance: [],
    passwordMinLength: env.PASSWORD_MIN_LENGTH,
  }

  if (env.SELF_HOSTED) {
    if (await isSqsMissing()) {
      ctx.body.maintenance.push({ type: MaintenanceType.SQS_MISSING })
    }
  }
}
