import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/component"

const router: Router = new Router()

router.get(
  "/api/:appId/components/definitions",
  authorized(permissions.BUILDER),
  controller.fetchAppComponentDefinitions
)

export default router
