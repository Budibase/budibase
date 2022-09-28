const Router = require("@koa/router")
const controller = require("../controllers/templates")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")

const router = new Router()

router
  .get("/api/templates", authorized(BUILDER), controller.fetch)
  .get(
    "/api/templates/:type/:name",
    authorized(BUILDER),
    controller.downloadTemplate
  )

module.exports = router
