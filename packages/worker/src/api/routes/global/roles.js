const Router = require("@koa/router")
const controller = require("../../controllers/global/roles")
const adminOnly = require("../../../middleware/adminOnly")

const router = Router()

router
  .get("/api/global/roles", adminOnly, controller.fetch)
  .get("/api/global/roles/:appId", adminOnly, controller.find)

module.exports = router
