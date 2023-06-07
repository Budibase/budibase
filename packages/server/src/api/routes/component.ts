import Router from "@koa/router"
import * as controller from "../controllers/component"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router.get(
  "/api/:appId/components/definitions",
  authorized(permissions.BUILDER),
  controller.fetchAppComponentDefinitions
)

export default router
