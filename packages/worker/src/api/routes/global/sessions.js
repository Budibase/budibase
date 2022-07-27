const Router = require("@koa/router")
const controller = require("../../controllers/global/sessions")
const { adminOnly } = require("@budibase/backend-core/auth")

const router = Router()

router
  .get("/api/global/sessions", adminOnly, controller.fetch)
  .get("/api/global/sessions/self", controller.selfSessions)
  .get("/api/global/sessions/:userId", adminOnly, controller.find)
  .delete("/api/global/sessions/:userId", adminOnly, controller.invalidateUser)
  .delete("/api/global/sessions/self/:sessionId", controller.invalidateSession)

module.exports = router
