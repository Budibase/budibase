import Router from "@koa/router"
import * as controller from "../controllers/auth"

const router: Router = new Router()

router.get("/api/self", controller.fetchSelf)

export default router
