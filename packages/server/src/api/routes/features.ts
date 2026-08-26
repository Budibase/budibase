import * as controller from "../controllers/features"
import { debugUIEnabled } from "../../middleware/debugUIEnabled"
import { validateBody } from "../../middleware/zod-validator"
import { builderAdminRoutes } from "./endpointGroups"
import { z } from "zod"

const validator = z.object({
  flags: z.record(z.string(), z.boolean()),
})

builderAdminRoutes.patch(
  "/api/features",
  debugUIEnabled,
  validateBody(validator),
  controller.override
)
