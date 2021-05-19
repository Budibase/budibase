const Router = require("@koa/router")
const controller = require("../../controllers/admin/roles")
const adminOnly = require("../../../middleware/adminOnly")

const router = Router()

router
  .get("/api/admin/roles", adminOnly, controller.fetch)
  .get("/api/admin/roles/:appId", adminOnly, controller.find)

module.exports = router
