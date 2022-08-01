const Router = require("@koa/router")
const controller = require("../../controllers/system/tenants")
const { adminOnly } = require("@budibase/backend-core/auth")

const router = Router()

router
  .get("/api/system/tenants/:tenantId/exists", controller.exists)
  .get("/api/system/tenants", adminOnly, controller.fetch)
  .delete("/api/system/tenants/:tenantId", adminOnly, controller.delete)

module.exports = router
