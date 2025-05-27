import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/navigation"

const router: Router = new Router()

router.put(
  "/api/navigation/:appId",
  authorized(permissions.BUILDER),
  controller.update
)

export default router
