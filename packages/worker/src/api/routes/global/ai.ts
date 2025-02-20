import Router from "@koa/router"
import * as authController from "../../controllers/global/ai"

const router: Router = new Router()

router.post("/api/global/ai/prompt", authController.prompt)

export default router
