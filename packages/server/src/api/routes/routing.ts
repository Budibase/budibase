import * as controller from "../controllers/routing"
import { ensureUserBelongsToWorkspaceTenant } from "../../middleware/ensureUserBelongsToWorkspaceTenant"
import { publicRoutes, builderRoutes } from "./endpointGroups"

// gets correct structure for user role
publicRoutes.get(
  "/api/routing/client",
  ensureUserBelongsToWorkspaceTenant,
  controller.clientFetch
)
// gets the full structure, not just the correct screen ID for user role
builderRoutes.get("/api/routing", controller.fetch)
