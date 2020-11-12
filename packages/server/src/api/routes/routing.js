const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const controller = require("../controllers/routing")

const router = Router()

router.post("/api/routing", authorized(BUILDER), controller.fetch)

module.exports = router
