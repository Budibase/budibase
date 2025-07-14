import * as controller from "../controllers/features"
import { validateBody } from "../../middleware/zod-validator"
import { publicGroup } from "./endpointGroups"
import { z } from "zod"

const validator = z.object({
  flags: z.record(z.boolean()),
})

publicGroup.patch("/api/features", validateBody(validator), controller.override)
