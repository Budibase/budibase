import Router from "@koa/router"
import * as controller from "../../controllers/system/tenants"
import { middleware } from "@budibase/backend-core"

const router: Router = new Router()

router.delete(
  "/api/system/tenants/:tenantId",
  middleware.adminOnly,
  controller.destroy
)

router.get("/api/system/tenants/:tenantId/info", controller.info)

export default router
