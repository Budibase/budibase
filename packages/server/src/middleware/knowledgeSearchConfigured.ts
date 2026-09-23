import type { Ctx } from "@budibase/types"
import type { Next } from "koa"
import sdk from "../sdk"

export const knowledgeSearchConfigured = (_ctx: Ctx, next: Next) => {
  sdk.ai.knowledgeBase.getGeminiApiKey()
  return next()
}
