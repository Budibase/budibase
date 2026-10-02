import * as controller from "../controllers/platformActions"
import { builderAdminRoutes } from "./endpointGroups"
import { fetchActionSessionEventsParamsValidator } from "./utils/validators/platformActions"

builderAdminRoutes
  .get("/api/actions/sessions", controller.fetchActionSessions)
  .get(
    "/api/actions/sessions/:sourceType/:sourceId/events",
    fetchActionSessionEventsParamsValidator(),
    controller.fetchActionSessionEvents
  )
