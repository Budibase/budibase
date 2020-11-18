const Router = require("@koa/router")
const controller = require("../controllers/application")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router
  .get("/api/:appId/definition", controller.fetchAppDefinition)
  .get("/api/applications", authorized(BUILDER), controller.fetch)
  .get(
    "/api/:appId/appPackage",
    authorized(BUILDER),
    controller.fetchAppPackage
  )
  .put("/api/:appId", authorized(BUILDER), controller.update)
  .post("/api/applications", authorized(BUILDER), controller.create)
  .delete("/api/:appId", authorized(BUILDER), controller.delete)

module.exports = router
