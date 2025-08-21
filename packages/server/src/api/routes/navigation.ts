import * as controller from "../controllers/navigation"
import { builderRoutes } from "./endpointGroups"

builderRoutes.put("/api/navigation/:workspaceAppId", controller.update)
