const Router = require("@koa/router")
const controller = require("../../controllers/global/roles")
const { builderOrAdmin } = require("@budibase/backend-core/auth")

const router = Router()

router
  .get("/api/global/roles", builderOrAdmin, controller.fetch)
  .get("/api/global/roles/:appId", builderOrAdmin, controller.find)
  .delete("/api/global/roles/:appId", builderOrAdmin, controller.removeAppRole)

module.exports = router
