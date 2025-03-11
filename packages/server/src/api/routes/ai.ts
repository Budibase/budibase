import Router from "@koa/router"
import * as controller from "../controllers/ai"
import { auth } from "@budibase/backend-core"

const router: Router = new Router()

router.post("/api/ai/js", auth.builderOrAdmin, controller.generateJs)

export default router
