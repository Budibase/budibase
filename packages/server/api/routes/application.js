const Router = require("@koa/router")
const controller = require("../controllers/application")

const router = Router()

router
  .get("/api/:clientId/applications", controller.fetch)
  .get("/api/:clientId/:applicationId/appPackage", controller.fetchAppPackage)
  .post("/api/:clientId/applications", controller.create)

module.exports = router
