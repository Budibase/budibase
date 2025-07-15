import * as controller from "../controllers/permission"
import { permissionValidator } from "./utils/validators"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/permission/builtin", controller.fetchBuiltin)
  .get("/api/permission/levels", controller.fetchLevels)
  .get("/api/permission", controller.fetch)
  .get("/api/permission/:resourceId", controller.getResourcePerms)
  .get(
    "/api/permission/:resourceId/dependants",
    controller.getDependantResources
  )
  // adding a specific role/level for the resource overrides the underlying access control
  .post(
    "/api/permission/:roleId/:resourceId/:level",
    permissionValidator(),
    controller.addPermission
  )
  // deleting the level defaults it back the underlying access control for the resource
  .delete(
    "/api/permission/:roleId/:resourceId/:level",
    permissionValidator(),
    controller.removePermission
  )
