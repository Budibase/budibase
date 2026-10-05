import type { UserCtx } from "@budibase/types"
import type { Next } from "koa"
import * as controller from "../controllers/platformActions"
import { endpointGroupList } from "./endpointGroups"
import { fetchActionSessionEventsParamsValidator } from "./utils/validators/platformActions"
import { auth } from "@budibase/backend-core"

async function requireWorkspace(ctx: UserCtx, next: Next) {
  if (!ctx.appId) {
    ctx.throw(400, "Workspace ID is required")
  }
  return next()
}

const actionsRoutes = endpointGroupList.group(requireWorkspace)

actionsRoutes
  .get(
    "/api/actions/sessions",
    auth.builderOrAdmin,
    controller.fetchActionSessions
  )
  .get(
    "/api/actions/sessions/:sourceType/:sourceId/events",
    auth.builderOrAdmin,
    fetchActionSessionEventsParamsValidator(),
    controller.fetchActionSessionEvents
  )
