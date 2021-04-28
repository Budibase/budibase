const Router = require("@koa/router")
const controller = require("../controllers/dev")
const env = require("../../environment")

const router = Router()

if (env.isDev() || env.isTest()) {
  router
    .get("/api/admin/:devPath(.*)", controller.redirectGet)
    .post("/api/admin/:devPath(.*)", controller.redirectPost)
    .delete("/api/admin/:devPath(.*)", controller.redirectDelete)
}

module.exports = router
