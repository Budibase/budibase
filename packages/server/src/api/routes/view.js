const Router = require("@koa/router")
const viewController = require("../controllers/view")
const rowController = require("../controllers/row")
const authorized = require("../../middleware/authorized")
const {
  BUILDER,
  PermissionTypes,
  PermissionLevels,
} = require("../../utilities/security/permissions")
const usage = require("../../middleware/usageQuota")

const router = Router()

router
  .get(
    "/api/views/:viewName",
    authorized(PermissionTypes.VIEW, PermissionLevels.READ),
    rowController.fetchView
  )
  .get("/api/views", authorized(BUILDER), viewController.fetch)
  .delete(
    "/api/views/:viewName",
    authorized(BUILDER),
    usage,
    viewController.destroy
  )
  .post("/api/views", authorized(BUILDER), usage, viewController.save)
  .post("/api/views/export", authorized(BUILDER), viewController.exportView)

module.exports = router
