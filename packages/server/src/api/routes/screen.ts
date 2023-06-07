import Router from "@koa/router"
import * as controller from "../controllers/screen"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { screenValidator } from "./utils/validators"

const router: Router = new Router()

router
  .get("/api/screens", authorized(permissions.BUILDER), controller.fetch)
  .post(
    "/api/screens",
    authorized(permissions.BUILDER),
    screenValidator(),
    controller.save
  )
  .delete(
    "/api/screens/:screenId/:screenRev",
    authorized(permissions.BUILDER),
    controller.destroy
  )

export default router
