import type { UserCtx } from "@budibase/types"
import type { Next } from "koa"
import * as controller from "../controllers/platformActions"
import { builderAdminRoutes } from "./endpointGroups"
import { fetchActionSessionEventsParamsValidator } from "./utils/validators/platformActions"

async function requireWorkspace(ctx: UserCtx, next: Next) {
  if (!ctx.appId) {
    ctx.throw(400, "Workspace ID is required")
  }
  return next()
}

builderAdminRoutes
  .get(
    "/api/actions/sessions",
    requireWorkspace,
    controller.fetchActionSessions
  )
  .get(
    "/api/actions/sessions/:sourceType/:sourceId/events",
    requireWorkspace,
    fetchActionSessionEventsParamsValidator(),
    controller.fetchActionSessionEvents
  )
