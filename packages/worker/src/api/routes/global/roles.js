const Router = require("@koa/router")
const controller = require("../../controllers/global/roles")
const { adminOnly } = require("@budibase/backend-core/auth")

const router = Router()

router
  .get("/api/global/roles", adminOnly, controller.fetch)
  .get("/api/global/roles/:appId", adminOnly, controller.find)
  .delete("/api/global/roles/:appId", adminOnly, controller.removeAppRole)

module.exports = router
