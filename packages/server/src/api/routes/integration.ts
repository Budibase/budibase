import Router from "@koa/router"
import * as controller from "../controllers/integration"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get("/api/integrations", authorized(permissions.BUILDER), controller.fetch)
  .get(
    "/api/integrations/:type",
    authorized(permissions.BUILDER),
    controller.find
  )

export default router
