const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const controller = require("../controllers/analytics")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router.get("/api/analytics", authorized(BUILDER), controller.isEnabled)

module.exports = router
