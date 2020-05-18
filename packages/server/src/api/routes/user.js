const Router = require("@koa/router")
const controller = require("../controllers/user")

const router = Router()

router
  .get("/api/:instanceId/users", controller.fetch)
  .get("/api/:instanceId/users/:username", controller.find)
  .post("/api/:instanceId/users", controller.create)
  .delete("/api/:instanceId/users/:username", controller.destroy)

module.exports = router
