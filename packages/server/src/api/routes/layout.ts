import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/layout"

const router: Router = new Router()

router
  .post("/api/layouts", authorized(permissions.BUILDER), controller.save)
  .delete(
    "/api/layouts/:layoutId/:layoutRev",
    authorized(permissions.BUILDER),
    controller.destroy
  )

export default router
