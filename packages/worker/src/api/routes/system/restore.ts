import Router from "@koa/router"
import * as controller from "../../controllers/system/restore"

const router: Router = new Router()

router.post("/api/system/restored", controller.systemRestored)

export default router
