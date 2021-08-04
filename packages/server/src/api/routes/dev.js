const Router = require("@koa/router")
const controller = require("../controllers/dev")
const env = require("../../environment")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/auth/permissions")

const router = Router()

if (env.isDev() || env.isTest()) {
  router
    .get("/api/global/:devPath(.*)", controller.redirectGet)
    .post("/api/global/:devPath(.*)", controller.redirectPost)
    .delete("/api/global/:devPath(.*)", controller.redirectDelete)
}

router
  .get("/api/dev/version", authorized(BUILDER), controller.getBudibaseVersion)
  .delete("/api/dev/:appId/lock", authorized(BUILDER), controller.clearLock)
  .post("/api/dev/:appId/revert", authorized(BUILDER), controller.revert)

module.exports = router
