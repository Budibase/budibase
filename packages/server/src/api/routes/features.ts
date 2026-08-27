import * as controller from "../controllers/features"
import { featureFlagOverridesEnabled } from "../../middleware/featureFlagOverridesEnabled"
import { publicRoutes } from "./endpointGroups"

publicRoutes.patch(
  "/api/features",
  featureFlagOverridesEnabled,
  controller.override
)
