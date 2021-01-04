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
    "/api/datasources/:id",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    datasourceController.find
  )
  .post("/api/datasources", authorized(BUILDER), datasourceController.save)
  .post(
    "/api/datasources/:datasourceId/queries",
    authorized(BUILDER),
    datasourceController.saveQuery
  )
  .post(
    "/api/datasources/queries/preview",
    authorized(BUILDER),
    datasourceController.previewQuery
  )
  .get(
    "/api/datasources/:datasourceId/queries/:queryId",
    authorized(BUILDER),
    datasourceController.fetchQuery
  )
  .post(
    "/api/datasources/:datasourceId/queries/:queryId",
    authorized(BUILDER),
    datasourceController.executeQuery
  )
  .delete(
    "/api/datasources/:datasourceId/:revId",
    authorized(BUILDER),
    datasourceController.destroy
  )

module.exports = router
