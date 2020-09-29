const Router = require("@koa/router")
const controller = require("../controllers/templates")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/templates", authorized(BUILDER), controller.fetch)
  .get(
    "/api/templates/:type/:name",
    authorized(BUILDER),
    controller.downloadTemplate
  )
  .post("/api/templates", authorized(BUILDER), controller.exportTemplateFromApp)

module.exports = router
