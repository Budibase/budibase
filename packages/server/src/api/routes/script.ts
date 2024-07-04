import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/script"

const router: Router = new Router()

router.post("/api/script", authorized(permissions.BUILDER), controller.save)

export default router
