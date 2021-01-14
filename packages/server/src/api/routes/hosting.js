const Router = require("@koa/router")
const controller = require("../controllers/hosting")
const authorized = require("../../middleware/authorized")
const selfhost = require("../../middleware/selfhost")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router
  .get("/api/hosting/info", authorized(BUILDER), controller.fetchInfo)
  .get("/api/hosting/urls", authorized(BUILDER), controller.fetchUrls)
  .get("/api/hosting", authorized(BUILDER), controller.fetch)
  .post("/api/hosting", authorized(BUILDER), controller.save)
  .get(
    "/api/hosting/apps",
    authorized(BUILDER),
    selfhost,
    controller.getDeployedApps
  )

module.exports = router
