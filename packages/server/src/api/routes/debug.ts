import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/debug"

const router: Router = new Router()

router.get(
  "/api/debug/diagnostics",
  authorized(permissions.BUILDER),
  controller.systemDebugInfo
)

export default router
