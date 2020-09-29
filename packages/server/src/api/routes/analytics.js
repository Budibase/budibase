const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")
const controller = require("../controllers/analytics")

const router = Router()

router.get("/api/analytics", authorized(BUILDER), controller.isEnabled)

module.exports = router
