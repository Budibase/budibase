const Router = require("@koa/router")
const queryController = require("../controllers/query")
const authorized = require("../../middleware/authorized")
const {
  PermissionLevels,
  PermissionTypes,
  BUILDER,
} = require("@budibase/backend-core/permissions")
const {
  bodyResource,
  bodySubResource,
  paramResource,
} = require("../../middleware/resourceId")
const {
  generateQueryPreviewValidation,
  generateQueryValidation,
} = require("../controllers/query/validation")

const router = new Router()

router
  .get("/api/queries", authorized(BUILDER), queryController.fetch)
  .post(
    "/api/queries",
    bodySubResource("datasourceId", "_id"),
    authorized(BUILDER),
    generateQueryValidation(),
    queryController.save
  )
  .post("/api/queries/import", authorized(BUILDER), queryController.import)
  .post(
    "/api/queries/preview",
    bodyResource("datasourceId"),
    authorized(BUILDER),
    generateQueryPreviewValidation(),
    queryController.preview
  )
  .get(
    "/api/queries/:queryId",
    paramResource("queryId"),
    authorized(PermissionTypes.QUERY, PermissionLevels.READ),
    queryController.find
  )
  // DEPRECATED - use new query endpoint for future work
  .post(
    "/api/queries/:queryId",
    paramResource("queryId"),
    authorized(PermissionTypes.QUERY, PermissionLevels.WRITE),
    queryController.executeV1
  )
  .post(
    "/api/v2/queries/:queryId",
    paramResource("queryId"),
    authorized(PermissionTypes.QUERY, PermissionLevels.WRITE),
    queryController.executeV2
  )
  .delete(
    "/api/queries/:queryId/:revId",
    paramResource("queryId"),
    authorized(BUILDER),
    queryController.destroy
  )

module.exports = router
