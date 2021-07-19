const Router = require("@koa/router")
const controller = require("../../controllers/admin/tenants")
const adminOnly = require("../../../middleware/adminOnly")

const router = Router()

router
  .get("/api/admin/tenants/enabled", controller.multiTenancyEnabled)
  .get("/api/admin/tenants/:tenantId/exists", controller.exists)
  .get("/api/admin/tenants", adminOnly, controller.fetch)

module.exports = router