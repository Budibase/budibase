import * as controller from "../controllers/features"
import { featureFlagOverridesEnabled } from "../../middleware/featureFlagOverridesEnabled"
import { validateBody } from "../../middleware/zod-validator"
import { publicRoutes } from "./endpointGroups"
import { z } from "zod"

const validator = z.object({
  flags: z.record(z.string(), z.boolean()),
})

publicRoutes.patch(
  "/api/features",
  featureFlagOverridesEnabled,
  validateBody(validator),
  controller.override
)
