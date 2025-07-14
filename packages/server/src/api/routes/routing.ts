import * as controller from "../controllers/routing"
import { publicGroup, builderGroup } from "./endpointGroups"

// gets correct structure for user role
publicGroup.get("/api/routing/client", controller.clientFetch)
// gets the full structure, not just the correct screen ID for user role
builderGroup.get("/api/routing", controller.fetch)
