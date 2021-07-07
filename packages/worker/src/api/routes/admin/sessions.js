const Router = require("@koa/router")
const controller = require("../../controllers/admin/sessions")
const adminOnly = require("../../../middleware/adminOnly")

const router = Router()

router
  .get("/api/admin/sessions", adminOnly, controller.fetch)
  .get("/api/admin/sessions/self", controller.selfSessions)
  .get("/api/admin/sessions/:userId", adminOnly, controller.find)
  .delete("/api/admin/sessions/:userId", adminOnly, controller.invalidateUser)
  .delete("/api/admin/sessions/self/:sessionId", controller.invalidateSession)

module.exports = router
