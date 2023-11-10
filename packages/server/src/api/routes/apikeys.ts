import Router from "@koa/router"
import * as controller from "../controllers/apikeys"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get("/api/keys", authorized(permissions.BUILDER), controller.fetch)
  .put("/api/keys/:key", authorized(permissions.BUILDER), controller.update)

export default router
