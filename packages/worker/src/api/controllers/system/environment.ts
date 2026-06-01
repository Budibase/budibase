import { env as coreEnv, db as dbCore } from "@budibase/backend-core"
import { helpers } from "@budibase/shared-core"
import { Ctx, GetEnvironmentResponse, MaintenanceType } from "@budibase/types"
import nodeFetch from "node-fetch"
import env from "../../../environment"

let sqsAvailable: boolean | undefined
let sqsLastChecked: number | undefined
const SQS_AVAILABLE_CACHE_TTL_MS = 30_000

async function isSqsAvailable() {
  const now = Date.now()
  if (
    sqsAvailable !== undefined &&
    sqsLastChecked !== undefined &&
    now - sqsLastChecked < SQS_AVAILABLE_CACHE_TTL_MS
  ) {
    return sqsAvailable
  }

  try {
    const { sqlUrl } = dbCore.getCouchInfo()
    if (!sqlUrl) {
      sqsAvailable = false
      sqsLastChecked = now
      return false
    }
    await helpers.retry(
      async () => {
        await nodeFetch(sqlUrl, { timeout: 2000 })
      },
      { times: 3 }
    )
    sqsAvailable = true
    sqsLastChecked = now
    return true
  } catch (e) {
    console.warn("failed to connect to SQS", e)
    sqsAvailable = false
    sqsLastChecked = now
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
