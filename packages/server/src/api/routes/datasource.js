const Router = require("@koa/router")
const datasourceController = require("../controllers/datasource")
const authorized = require("../../middleware/authorized")
const {
  BUILDER,
  PermissionLevel,
  PermissionType,
} = require("@budibase/backend-core/permissions")
const {
  datasourceValidator,
  datasourceQueryValidator,
} = require("./utils/validators")

const router = new Router()

router
  .get("/api/datasources", authorized(BUILDER), datasourceController.fetch)
  .get(
    "/api/datasources/:datasourceId",
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    datasourceController.find
  )
  .put(
    "/api/datasources/:datasourceId",
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    datasourceController.update
  )
  .post(
    "/api/datasources/query",
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    datasourceQueryValidator(),
    datasourceController.query
  )
  .post(
    "/api/datasources/:datasourceId/schema",
    authorized(BUILDER),
    datasourceController.buildSchemaFromDb
  )
  .post(
    "/api/datasources",
    authorized(BUILDER),
    datasourceValidator(),
    datasourceController.save
  )
  .delete(
    "/api/datasources/:datasourceId/:revId",
    authorized(BUILDER),
    datasourceController.destroy
  )

module.exports = router
