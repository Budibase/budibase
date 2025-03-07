import Router from "@koa/router"
import * as controller from "../controllers/apikeys"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { PermissionLevel } from "@budibase/types"

const router: Router = new Router()

router
  .get(
    "/api/keys",
    authorized(permissions.BUILDER, PermissionLevel.READ),
    controller.fetch
  )
  .put(
    "/api/keys/:key",
    authorized(permissions.BUILDER, PermissionLevel.WRITE),
    controller.update
  )

export default router
