import type { Ctx } from "@budibase/types"
import type { Next } from "koa"
import sdk from "../sdk"

export const knowledgeSearchConfigured = async (_ctx: Ctx, next: Next) => {
  await sdk.ai.knowledgeBase.guardGeminiFileSearchConfigured()
  return next()
}
