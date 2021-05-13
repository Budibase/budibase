const Router = require("@koa/router")
const controller = require("../controllers/dev")
const env = require("../../environment")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

if (env.isDev() || env.isTest()) {
  router
    .get("/api/admin/:devPath(.*)", controller.redirectGet)
    .post("/api/admin/:devPath(.*)", controller.redirectPost)
    .delete("/api/admin/:devPath(.*)", controller.redirectDelete)
}

router.delete(
  "/api/dev/:appId/lock",
  authorized(BUILDER),
  controller.clearLock
)

module.exports = router
