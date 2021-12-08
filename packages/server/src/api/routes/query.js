const Router = require("@koa/router")
const queryController = require("../controllers/query")
const authorized = require("../../middleware/authorized")
const {
  PermissionLevels,
  PermissionTypes,
  BUILDER,
} = require("@budibase/auth/permissions")
const {
  bodyResource,
  bodySubResource,
  paramResource,
} = require("../../middleware/resourceId")
const {
  generateQueryPreviewValidation,
  generateQueryValidation,
} = require("../controllers/query/validation")

const router = Router()

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
  .post(
    "/api/queries/:queryId",
    paramResource("queryId"),
    authorized(PermissionTypes.QUERY, PermissionLevels.WRITE),
    queryController.execute
  )
  .delete(
    "/api/queries/:queryId/:revId",
    paramResource("queryId"),
    authorized(BUILDER),
    queryController.destroy
  )

module.exports = router
