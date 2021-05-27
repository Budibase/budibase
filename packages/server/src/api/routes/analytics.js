const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const controller = require("../controllers/analytics")
const { BUILDER } = require("@budibase/auth/permissions")

const router = Router()

router.get("/api/analytics", controller.isEnabled)

module.exports = router
