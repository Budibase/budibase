import Router from "@koa/router"
import * as controller from "../../controllers/global/events"

const router: Router = new Router()

router.post("/api/global/event/publish", controller.publish)

export default router
