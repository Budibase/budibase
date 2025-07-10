import Router from "@koa/router"
import * as controller from "../controllers/apikeys"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { EndpointGroup } from "../utils"

const group = new EndpointGroup()

group.addGroupMiddleware(authorized(permissions.BUILDER))

group
  .get("/api/keys", controller.fetch)
  .put("/api/keys/:key", controller.update)

const router: Router = group.apply()

export default router
