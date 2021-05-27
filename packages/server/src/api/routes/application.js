const Router = require("@koa/router")
const controller = require("../controllers/application")
const authorized = require("../../middleware/authorized")
const { BUILDER, PermissionTypes, PermissionLevels } = require("@budibase/auth/permissions")

const router = Router()

router
  .get("/api/applications/:appId/definition", controller.fetchAppDefinition)
  .get("/api/applications", authorized(PermissionTypes.APP, PermissionLevels.READ), controller.fetch)
  .get(
    "/api/applications/:appId/appPackage",
    authorized(PermissionTypes.APP, PermissionLevels.READ),
    controller.fetchAppPackage
  )
  .put("/api/applications/:appId", authorized(BUILDER), controller.update)
  .post("/api/applications", authorized(BUILDER), controller.create)
  .delete("/api/applications/:appId", authorized(BUILDER), controller.delete)

module.exports = router
