const Router = require("@koa/router")
const controller = require("../../controllers/global/tenants")
const adminOnly = require("../../../middleware/adminOnly")

const router = Router()

router
  .get("/api/global/tenants/enabled", controller.multiTenancyEnabled)
  .get("/api/global/tenants/:tenantId/exists", controller.exists)
  .get("/api/global/tenants", adminOnly, controller.fetch)

module.exports = router
