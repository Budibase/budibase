const Router = require("@koa/router")
const viewController = require("../controllers/view")
const rowController = require("../controllers/row")
const authorized = require("../../middleware/authorized")
const { paramResource } = require("../../middleware/resourceId")
const {
  BUILDER,
  PermissionTypes,
  PermissionLevels,
} = require("../../utilities/security/permissions")
const usage = require("../../middleware/usageQuota")

const router = Router()

router
  .get("/api/views/export", authorized(BUILDER), viewController.exportView)
  .get(
    "/api/views/:viewName",
    paramResource("viewName"),
    authorized(PermissionTypes.VIEW, PermissionLevels.READ),
    rowController.fetchView
  )
  .get("/api/views", authorized(BUILDER), viewController.fetch)
  .delete(
    "/api/views/:viewName",
    paramResource("viewName"),
    authorized(BUILDER),
    usage,
    viewController.destroy
  )
  .post("/api/views", authorized(BUILDER), usage, viewController.save)

module.exports = router
