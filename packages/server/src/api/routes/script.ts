import Router from "@koa/router"
import * as controller from "../controllers/script"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router.post("/api/script", authorized(permissions.BUILDER), controller.save)

export default router
