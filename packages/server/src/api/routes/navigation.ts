import * as controller from "../controllers/navigation"
import { builderRoutes } from "./endpointGroups"

// TODO: remove when cleaning the flag FeatureFlag.WORKSPACE_APPS
builderRoutes.put("/api/navigation/:workspaceAppId", controller.update)
