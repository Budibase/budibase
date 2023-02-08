import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import * as controller from "../controllers/routing"

const router: Router = new Router()

router
  // gets correct structure for user role
  .get("/api/routing/client", controller.clientFetch)
  // gets the full structure, not just the correct screen ID for user role
  .get("/api/routing", authorized(permissions.BUILDER), controller.fetch)

export default router
