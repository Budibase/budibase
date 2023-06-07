import Router from "@koa/router"
import * as controller from "../controllers/templates"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get("/api/templates", authorized(permissions.BUILDER), controller.fetch)
  .get(
    "/api/templates/:type/:name",
    authorized(permissions.BUILDER),
    controller.downloadTemplate
  )

export default router
