import { auth } from "@budibase/backend-core"
import Router from "@koa/router"
import * as controller from "../controllers/ai"

const router: Router = new Router()

router.post("/api/ai/js", auth.builderOrAdmin, controller.generateJs)

router.post(
  "/api/ai/cron",
  auth.builderOrAdmin,
  controller.generateCronExpression
)

export default router
