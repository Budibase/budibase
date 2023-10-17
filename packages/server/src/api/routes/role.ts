import Router from "@koa/router"
import * as controller from "../controllers/role"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { roleValidator } from "./utils/validators"

const router: Router = new Router()

router
  // retrieve a list of the roles a user can access
  // needs to be public for public screens
  .get("/api/roles/accessible", controller.accessible)
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
