const Router = require("@koa/router")
const controller = require("../controllers/accesslevel")

const router = Router()

router
  .post("/api/accesslevels", controller.create)
  .put("/api/accesslevels", controller.update)
  .get("/api/accesslevels", controller.fetch)
  .get("/api/accesslevels/:levelId", controller.find)
  .delete("/api/accesslevels/:levelId/:rev", controller.destroy)
  .patch("/api/accesslevels/:levelId", controller.patch)

module.exports = router
