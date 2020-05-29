const Router = require("@koa/router")
const controller = require("../controllers/accesslevel")

const router = Router()

router
  .post("/api/:instanceId/accesslevels", controller.create)
  .put("/api/:instanceId/accesslevels", controller.update)
  .get("/api/:instanceId/accesslevels", controller.fetch)
  .get("/api/:instanceId/accesslevels/:levelId", controller.find)
  .delete("/api/:instanceId/accesslevels/:levelId/:rev", controller.destroy)
  .patch("/api/:instanceId/accesslevels/:levelId", controller.patch)

module.exports = router
