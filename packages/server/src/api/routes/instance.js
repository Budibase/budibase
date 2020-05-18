const Router = require("@koa/router")
const controller = require("../controllers/instance")

const router = Router()

router
  .post("/api/:applicationId/instances", controller.create)
  .delete("/api/instances/:instanceId", controller.destroy)

module.exports = router
