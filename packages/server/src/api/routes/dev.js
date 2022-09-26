const Router = require("@koa/router")
const controller = require("../controllers/dev")
const env = require("../../environment")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")

const router = new Router()

function redirectPath(path) {
  router
    .get(`/api/${path}/:devPath(.*)`, controller.buildRedirectGet(path))
    .post(`/api/${path}/:devPath(.*)`, controller.buildRedirectPost(path))
    .delete(`/api/${path}/:devPath(.*)`, controller.buildRedirectDelete(path))
}

if (env.isDev() || env.isTest()) {
  redirectPath("global")
  redirectPath("system")
}

router
  .get("/api/dev/version", authorized(BUILDER), controller.getBudibaseVersion)
  .delete("/api/dev/:appId/lock", authorized(BUILDER), controller.clearLock)
  .post("/api/dev/:appId/revert", authorized(BUILDER), controller.revert)

module.exports = router
