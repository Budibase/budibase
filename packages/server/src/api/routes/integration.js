const Router = require("@koa/router")
const controller = require("../controllers/integration")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router.get("/api/integrations", authorized(BUILDER), controller.fetch)

module.exports = router
