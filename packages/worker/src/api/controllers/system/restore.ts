import env from "../../../environment"
import { BBContext } from "@budibase/types"
import { cache } from "@budibase/backend-core"

export async function systemRestored(ctx: BBContext) {
  if (!env.SELF_HOSTED) {
    ctx.throw(405, "This operation is not allowed in cloud.")
  }
  await cache.bustCache(cache.CacheKey.CHECKLIST)
  ctx.body = {
    message: "System prepared after restore.",
  }
}
