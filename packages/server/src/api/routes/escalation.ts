import * as controller from "../controllers/escalation"
import { builderAdminRoutes } from "./endpointGroups"

// These aren't currently used but can be used to view or manage the escalations
builderAdminRoutes
  .get("/api/escalations", controller.fetch)
  .get("/api/escalations/context", controller.fetchContextDocs)
  .get("/api/escalations/context/:id", controller.findContextDoc)
  .get("/api/escalations/:id/result", controller.result)
  .get("/api/escalations/:id/notifications", controller.fetchNotifications)
  .post("/api/escalations/:id/resolve", controller.resolve)
  .post("/api/escalations/:id/cancel", controller.cancel)
