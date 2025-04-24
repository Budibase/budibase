import Router from "@koa/router"
import * as controller from "../controllers/features"

const router: Router = new Router()

router.patch("/api/features", controller.override)

export default router
