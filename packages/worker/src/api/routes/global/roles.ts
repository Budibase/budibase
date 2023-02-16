import Router from "@koa/router"
import * as controller from "../../controllers/global/roles"
import { auth } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get("/api/global/roles", auth.builderOrAdmin, controller.fetch)
  .get("/api/global/roles/:appId", auth.builderOrAdmin, controller.find)
  .delete(
    "/api/global/roles/:appId",
    auth.builderOrAdmin,
    controller.removeAppRole
  )

export default router
