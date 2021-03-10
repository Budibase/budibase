const Router = require("@koa/router")
const datasourceController = require("../controllers/datasource")
const authorized = require("../../middleware/authorized")
const {
  BUILDER,
  PermissionLevels,
  PermissionTypes,
} = require("../../utilities/security/permissions")

const router = Router()

router
  .get("/api/datasources", authorized(BUILDER), datasourceController.fetch)
  .get(
    "/api/datasources/:datasourceId",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    datasourceController.find
  )
  .post("/api/datasources", authorized(BUILDER), datasourceController.save)
  .delete(
    "/api/datasources/:datasourceId/:revId",
    authorized(BUILDER),
    datasourceController.destroy
  )

module.exports = router
