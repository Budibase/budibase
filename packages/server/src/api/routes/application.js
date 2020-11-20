const Router = require("@koa/router")
const controller = require("../controllers/application")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router
  .get("/api/applications/:appId/definition", controller.fetchAppDefinition)
  .get("/api/applications", authorized(BUILDER), controller.fetch)
  .get(
    "/api/applications/:appId/appPackage",
    authorized(BUILDER),
    controller.fetchAppPackage
  )
  .put("/api/applications/:appId", authorized(BUILDER), controller.update)
  .post("/api/applications", authorized(BUILDER), controller.create)
  .delete("/api/applications/:appId", authorized(BUILDER), controller.delete)

module.exports = router
