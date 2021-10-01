const Router = require("@koa/router")
const controller = require("../controllers/analytics")

const router = Router()

router.get("/api/analytics", controller.isEnabled)
router.post("/api/analytics/ping", controller.endUserPing)

module.exports = router
