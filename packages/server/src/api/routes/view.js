const Router = require("@koa/router")
const viewController = require("../controllers/view")
const rowController = require("../controllers/row")
const authorized = require("../../middleware/authorized")
const { BUILDER, READ_VIEW } = require("../../utilities/accessLevels")
const usage = require("../../middleware/usageQuota")

const router = Router()

router
  .get(
    "/api/views/:viewName",
    authorized(READ_VIEW, ctx => ctx.params.viewName),
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
  .get(
    "/api/views/export/download/:fileName",
    authorized(BUILDER),
    viewController.downloadExport
  )

module.exports = router
