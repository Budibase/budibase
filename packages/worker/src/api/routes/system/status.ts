import Router from "@koa/router"
import * as controller from "../../controllers/system/status"

const router: Router = new Router()

router.get("/api/system/status", controller.fetch)

export default router
