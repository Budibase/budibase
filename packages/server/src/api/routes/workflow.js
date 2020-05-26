const Router = require("@koa/router")
const controller = require("../controllers/workflow")

const router = Router()

router
  .get("/api/:instanceId/workflows", controller.fetch)
  .get("/api/:instanceId/workflows/:id", controller.find)
  .post("/api/:instanceId/workflows", controller.create)
  .put("/api/:instanceId/workflows/:id", controller.update)
  .delete("/api/:instanceId/workflows/:id/:rev", controller.destroy)

module.exports = router
