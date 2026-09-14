import type { Ctx } from "@budibase/types"
import type { Next } from "koa"
import { HTTPError } from "@budibase/backend-core"
import sdk from "../sdk"

export const knowledgeSearchConfigured = (_ctx: Ctx, next: Next) => {
  if (!sdk.ai.knowledgeBase.isKnowledgeSearchConfigured()) {
    throw new HTTPError(
      "Configure the selected knowledge provider in the server environment and restart Budibase.",
      400
    )
  }
  return next()
}
