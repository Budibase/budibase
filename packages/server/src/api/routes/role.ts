import Router from "@koa/router"
import * as controller from "../controllers/role"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { roleValidator } from "./utils/validators"

const router: Router = new Router()

router
  .post(
    "/api/roles",
    authorized(permissions.BUILDER),
    roleValidator(),
    controller.save
  )
  .get("/api/roles", authorized(permissions.BUILDER), controller.fetch)
  .get("/api/roles/:roleId", authorized(permissions.BUILDER), controller.find)
  .delete(
    "/api/roles/:roleId/:rev",
    authorized(permissions.BUILDER),
    controller.destroy
  )

export default router
