import * as controller from "../controllers/escalation"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/escalations", controller.fetch)
  .get("/api/escalations/context", controller.fetchContextDocs)
  .get("/api/escalations/context/:id", controller.findContextDoc)
  .get("/api/escalations/:id/notifications", controller.fetchNotifications)
  .post("/api/escalations/:id/resolve", controller.resolve)
  .post(
    // TODO: this endpoint will be called by external channel webhooks (Slack, Teams, Discord).
    // Auth should move to channel-specific signature verification middleware (e.g. Slack signing
    // secret, Discord public key) rather than Budibase builder auth. Route group will need to change.
    "/api/escalations/:id/notifications/:notificationId/respond",
    controller.respond
  )
  .delete("/api/escalations/:id", controller.cancel)
  // does this need to be an API method?
  // It would need significant permissions.
  .post("/api/escalations/resync", controller.resync)
