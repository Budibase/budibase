import { auth } from "@budibase/backend-core"
import * as controller from "../controllers/escalation"
import { endpointGroupList } from "./endpointGroups"
import { escalationEnabled } from "../../middleware/escalationEnabled"

// Gated behind the ESCALATION feature flag (same pattern AI_RAG/AI_TESTS use).
const escalationRoutes = endpointGroupList
  .group(auth.builderOrAdmin)
  .addGroupMiddleware(escalationEnabled)

escalationRoutes
  .get("/api/escalations", controller.fetch)
  .get("/api/escalations/context", controller.fetchContextDocs)
  .get("/api/escalations/context/:id", controller.findContextDoc)
  .get("/api/escalations/:id/result", controller.result)
  .get("/api/escalations/:id/notifications", controller.fetchNotifications)
  .post("/api/escalations/:id/resolve", controller.resolve)
  .post("/api/escalations/:id/cancel", controller.cancel)
