const Router = require("@koa/router")
const controller = require("../../controllers/admin/debug")
const adminOnly = require("../../../middleware/adminOnly")

const router = Router()

router.get("/api/admin/debug/logs", adminOnly, controller.fetchDebugLogs)

module.exports = router
