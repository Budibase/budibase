import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/screen"
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
