import * as controller from "../controllers/navigation"
import { builderGroup } from "./endpointGroups"

// TODO: remove when cleaning the flag FeatureFlag.WORKSPACE_APPS
builderGroup.put("/api/navigation/:appId", controller.update)
