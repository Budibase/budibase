import Router from "@koa/router"
import * as controller from "../controllers/permission"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { permissionValidator } from "./utils/validators"

const router: Router = new Router()

router
  .get(
    "/api/permission/builtin",
    authorized(permissions.BUILDER),
    controller.fetchBuiltin
  )
  .get(
    "/api/permission/levels",
    authorized(permissions.BUILDER),
    controller.fetchLevels
  )
  .get("/api/permission", authorized(permissions.BUILDER), controller.fetch)
  .get(
    "/api/permission/:resourceId",
    authorized(permissions.BUILDER),
    controller.getResourcePerms
  )
  .get(
    "/api/permission/:resourceId/dependants",
    authorized(permissions.BUILDER),
    controller.getDependantResources
  )
  // adding a specific role/level for the resource overrides the underlying access control
  .post(
    "/api/permission/:roleId/:resourceId/:level",
    authorized(permissions.BUILDER),
    permissionValidator(),
    controller.addPermission
  )
  // deleting the level defaults it back the underlying access control for the resource
  .delete(
    "/api/permission/:roleId/:resourceId/:level",
    authorized(permissions.BUILDER),
    permissionValidator(),
    controller.removePermission
  )

export default router
