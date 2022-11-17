import { accounts } from "@budibase/backend-core"
import env from "../../../environment"
import { BBContext } from "@budibase/types"

export const fetch = async (ctx: BBContext) => {
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const status = await accounts.getStatus()
    ctx.body = status
  } else {
    ctx.body = {
      health: {
        passing: true,
      },
    }
  }
}
