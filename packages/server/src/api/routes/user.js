const Router = require("@koa/router")
const controller = require("../controllers/user")

const router = Router()

router
  .get("/api/:instanceId/users", controller.fetch)
  .post("/api/:appId/:instanceId/users", controller.create)
  .delete("/api/:instanceId/users/:userId", controller.destroy)

module.exports = router
