import Router from "@koa/router"
import * as aiController from "../controllers/ai"

const router: Router = new Router()

router.post("/api/ai/parseReceipt", aiController.parseReceipt)

export default router
