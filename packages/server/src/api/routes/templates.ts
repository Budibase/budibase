import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/templates"

const router: Router = new Router()

router
  .get("/api/templates", authorized(permissions.BUILDER), controller.fetch)
  .get(
    "/api/templates/:type/:name",
    authorized(permissions.BUILDER),
    controller.downloadTemplate
  )

export default router
