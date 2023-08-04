import Router from "@koa/router"
import * as controller from "../controllers/plugin"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .post(
    "/api/plugin/upload",
    authorized(permissions.GLOBAL_BUILDER),
    controller.upload
  )
  .post(
    "/api/plugin",
    authorized(permissions.GLOBAL_BUILDER),
    controller.create
  )
  .get("/api/plugin", authorized(permissions.GLOBAL_BUILDER), controller.fetch)
  .delete(
    "/api/plugin/:pluginId",
    authorized(permissions.GLOBAL_BUILDER),
    controller.destroy
  )

export default router
