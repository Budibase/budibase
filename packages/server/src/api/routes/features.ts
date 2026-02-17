import * as controller from "../controllers/features"
import { validateBody } from "../../middleware/zod-validator"
import { endpointGroupList, publicRoutes } from "./endpointGroups"
import { middleware } from "@budibase/pro"
import { z } from "zod"

const validator = z.object({
  flags: z.record(z.string(), z.boolean()),
})
const cloudFlagsValidator = z.object({
  userId: z.string().optional(),
})
const licensedRoutes = endpointGroupList.group(middleware.licenseAuth)

publicRoutes.patch(
  "/api/features",
  validateBody(validator),
  controller.override
)

licensedRoutes.post(
  "/api/feature-flags",
  validateBody(cloudFlagsValidator),
  controller.getCloudFlags
)
