import * as controller from "../controllers/component"
import { builderRoutes } from "./endpointGroups"

builderRoutes.get(
  "/api/:appId/components/definitions",
  controller.fetchAppComponentDefinitions
)
