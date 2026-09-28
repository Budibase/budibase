import { auth } from "@budibase/backend-core"
import * as controller from "../controllers/escalation"
import { endpointGroupList } from "./endpointGroups"

const escalationRoutes = endpointGroupList.group(auth.builderOrAdmin)

escalationRoutes
  .get("/api/escalations", controller.fetch)
  .get("/api/escalations/context", controller.fetchContextDocs)
  .get("/api/escalations/context/:id", controller.findContextDoc)
  .get("/api/escalations/:id/result", controller.result)
  .get("/api/escalations/:id/notifications", controller.fetchNotifications)
  .post("/api/escalations/:id/resolve", controller.resolve)
  .post("/api/escalations/:id/cancel", controller.cancel)
