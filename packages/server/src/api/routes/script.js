const Router = require("@koa/router")
const controller = require("../controllers/hosting")
const authorized = require("../../middleware/authorized")
const selfhost = require("../../middleware/selfhost")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router
  .post("/api/script", authorized(BUILDER), controller.save)
  // this isn't risky, doesn't return anything about apps other than names and URLs
  .get("/api/hosting/apps", selfhost, controller.getDeployedApps)

module.exports = router
