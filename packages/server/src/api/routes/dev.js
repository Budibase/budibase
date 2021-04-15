const Router = require("@koa/router")
const controller = require("../controllers/dev")
const env = require("../../environment")

const router = Router()

if (env.isDev() || env.isTest()) {
  router.get("/api/admin/:path", controller.redirectGet)
  router.post("/api/admin/:path", controller.redirectPost)
  router.delete("/api/admin/:path", controller.redirectDelete)
}

module.exports = router
