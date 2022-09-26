const Router = require("@koa/router")
const controller = require("../controllers/permission")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")
const { permissionValidator } = require("./utils/validators")

const router = new Router()

router
  .get("/api/permission/builtin", authorized(BUILDER), controller.fetchBuiltin)
  .get("/api/permission/levels", authorized(BUILDER), controller.fetchLevels)
  .get("/api/permission", authorized(BUILDER), controller.fetch)
  .get(
    "/api/permission/:resourceId",
    authorized(BUILDER),
    controller.getResourcePerms
  )
  // adding a specific role/level for the resource overrides the underlying access control
  .post(
    "/api/permission/:roleId/:resourceId/:level",
    authorized(BUILDER),
    permissionValidator(),
    controller.addPermission
  )
  // deleting the level defaults it back the underlying access control for the resource
  .delete(
    "/api/permission/:roleId/:resourceId/:level",
    authorized(BUILDER),
    permissionValidator(),
    controller.removePermission
  )

module.exports = router
