const Router = require("@koa/router")
const controller = require("../controllers/workflow")

const router = Router()

router
  .get("/api/:instanceId/workflows", controller.fetch)
  .get("/api/:instanceId/workflows/:id", controller.find)
  .get("/api/:instanceId/workflows/:id/:action", controller.fetchActionScript)
  .post("/api/:instanceId/workflows", controller.create)
  .post("/api/:instanceId/workflows/action", controller.executeAction)
  .put("/api/:instanceId/workflows", controller.update)
  .delete("/api/:instanceId/workflows/:id/:rev", controller.destroy)

module.exports = router
