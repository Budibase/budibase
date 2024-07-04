import { middleware } from "@budibase/backend-core"
import Router from "@koa/router"
import * as controller from "../../controllers/system/tenants"

const router: Router = new Router()

router.delete(
  "/api/system/tenants/:tenantId",
  middleware.adminOnly,
  controller.destroy
)

export default router
