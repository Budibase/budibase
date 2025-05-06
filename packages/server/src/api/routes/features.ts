import Router from "@koa/router"
import * as controller from "../controllers/features"
import { validateBody } from "../../middleware/zod-validator"
import { z } from "zod"

const router: Router = new Router()

const validator = z.object({
  flags: z.record(z.boolean()),
})

router.patch("/api/features", validateBody(validator), controller.override)

export default router
