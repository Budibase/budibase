import Router from "@koa/router"
import * as controller from "../controllers/resource"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router.post(
  "/api/resources/usage",
  authorized(permissions.BUILDER),
  controller.searchForResourceUsage
)

export default router
