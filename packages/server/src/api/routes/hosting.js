const Router = require("@koa/router")
const controller = require("../controllers/hosting")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/auth/permissions")

const router = Router()

router
  .get("/api/hosting/urls", authorized(BUILDER), controller.fetchUrls)
  // this isn't risky, doesn't return anything about apps other than names and URLs
  .get("/api/hosting/apps", controller.getDeployedApps)

module.exports = router
