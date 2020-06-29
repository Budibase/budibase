const Router = require("@koa/router")
const controller = require("../controllers/application")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/applications", authorized(BUILDER), controller.fetch)
  .get(
    "/api/:applicationId/appPackage",
    authorized(BUILDER),
    controller.fetchAppPackage
  )
  .put("/api/:applicationId/appPackage", authorized(BUILDER), controller.update)
  .post("/api/applications", authorized(BUILDER), controller.create)

module.exports = router
