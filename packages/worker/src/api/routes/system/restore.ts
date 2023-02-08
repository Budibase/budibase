import * as controller from "../../controllers/system/restore"
import Router from "@koa/router"

const router: Router = new Router()

router.post("/api/system/restored", controller.systemRestored)

export default router
