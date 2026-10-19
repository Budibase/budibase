import { auth } from "@budibase/backend-core"
import * as controller from "../controllers/escalation"
import { endpointGroupList, publicRoutes } from "./endpointGroups"

const escalationRoutes = endpointGroupList.group(auth.builderOrAdmin)

escalationRoutes
  .get("/api/escalations", controller.fetch)
  .get("/api/escalations/context", controller.fetchContextDocs)
  .get("/api/escalations/context/:id", controller.findContextDoc)
  .get("/api/escalations/:id/result", controller.result)
  .get("/api/escalations/:id/notifications", controller.fetchNotifications)
  .post("/api/escalations/:id/resolve", controller.resolve)
  .post("/api/escalations/:id/cancel", controller.cancel)

// Approvers need not be builders, so this sits outside the authorized groups
// and has to apply CSRF protection itself
publicRoutes.post(
  "/api/escalations/:id/respond",
  auth.buildCsrfMiddleware(),
  controller.respond
)
