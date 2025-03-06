import Router from "@koa/router"
import * as controller from "../controllers/ai"

const router: Router = new Router()

router.post("/api/ai/js", controller.generateJs)

export default router
