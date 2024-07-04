import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/apikeys"

const router: Router = new Router()

router
  .get("/api/keys", authorized(permissions.BUILDER), controller.fetch)
  .put("/api/keys/:key", authorized(permissions.BUILDER), controller.update)

export default router
