import Router from "@koa/router"
import * as controller from "../controllers/recaptcha"

const router: Router = new Router()

router.post("/api/recaptcha/verify", controller.verify)

export default router