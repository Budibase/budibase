import { middleware } from "@budibase/backend-core"
import Router from "@koa/router"
import * as controller from "../../controllers/system/logs"

const router: Router = new Router()

router.get("/api/system/logs", middleware.adminOnly, controller.getLogs)

export default router
