const Router = require("@koa/router")
const controller = require("../../controllers/admin/roles")

const router = Router()


router
  .get("/api/admin/roles", controller.fetch)
  .get("/api/admin/roles/:appId", controller.find)

module.exports = router
