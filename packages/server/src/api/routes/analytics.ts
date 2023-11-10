import Router from "@koa/router"
import * as controller from "../controllers/analytics"

const router: Router = new Router()

router.get("/api/bbtel", controller.isEnabled)
router.post("/api/bbtel/ping", controller.ping)

export default router
