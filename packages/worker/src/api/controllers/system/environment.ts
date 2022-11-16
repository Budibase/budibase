import { BBContext } from "@budibase/types"
import env from "../../../environment"

export const fetch = async (ctx: BBContext) => {
  ctx.body = {
    multiTenancy: !!env.MULTI_TENANCY,
    cloud: !env.SELF_HOSTED,
    accountPortalUrl: env.ACCOUNT_PORTAL_URL,
    disableAccountPortal: env.DISABLE_ACCOUNT_PORTAL,
    // in test need to pretend its in production for the UI (Cypress)
    isDev: env.isDev() && !env.isTest(),
  }
}
