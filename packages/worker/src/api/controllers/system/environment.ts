import { Ctx } from "@budibase/types"
import env from "../../../environment"

export const fetch = async (ctx: Ctx) => {
  ctx.body = {
    multiTenancy: !!env.MULTI_TENANCY,
    offlineMode: !!env.OFFLINE_MODE,
    cloud: !env.SELF_HOSTED,
    accountPortalUrl: env.ACCOUNT_PORTAL_URL,
    disableAccountPortal: env.DISABLE_ACCOUNT_PORTAL,
    baseUrl: env.PLATFORM_URL,
    // in test need to pretend its in production for the UI (Cypress)
    isDev: env.isDev() && !env.isTest(),
  }
}
