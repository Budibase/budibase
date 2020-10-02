const Router = require("@koa/router")
const viewController = require("../controllers/view")
const recordController = require("../controllers/record")
const authorized = require("../../middleware/authorized")
const { BUILDER, READ_VIEW } = require("../../utilities/accessLevels")

const router = Router()

router
  .get(
    "/api/views/:viewName",
    authorized(READ_VIEW, ctx => ctx.params.viewName),
    recordController.fetchView
  )
  .get("/api/views", authorized(BUILDER), viewController.fetch)
  .delete("/api/views/:viewName", authorized(BUILDER), viewController.destroy)
  .post("/api/views", authorized(BUILDER), viewController.save)
  .post("/api/views/export", authorized(BUILDER), viewController.exportView)
  .get(
    "/api/views/export/download/:fileName",
    authorized(BUILDER),
    viewController.downloadExport
  )

module.exports = router
