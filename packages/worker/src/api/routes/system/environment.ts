import Router from "@koa/router"
import * as controller from "../../controllers/system/environment"

const router: Router = new Router()

router.get("/api/system/environment", controller.fetch)

export default router
