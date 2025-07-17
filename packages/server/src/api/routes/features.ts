import * as controller from "../controllers/features"
import { validateBody } from "../../middleware/zod-validator"
import { publicRoutes } from "./endpointGroups"
import { z } from "zod"

const validator = z.object({
  flags: z.record(z.boolean()),
})

publicRoutes.patch(
  "/api/features",
  validateBody(validator),
  controller.override
)
