import * as controller from "../controllers/component"
import { builderGroup } from "./endpointGroups"

builderGroup.get(
  "/api/:appId/components/definitions",
  controller.fetchAppComponentDefinitions
)
