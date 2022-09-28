const Router = require("@koa/router")
const controller = require("../controllers/cloud")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")

const router = new Router()

router
  .get("/api/cloud/export", authorized(BUILDER), controller.exportApps)
  // has to be public, only run if apps don't exist
  .post("/api/cloud/import", controller.importApps)
  .get("/api/cloud/import/complete", controller.hasBeenImported)

module.exports = router
