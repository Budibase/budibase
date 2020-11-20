const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const controller = require("../controllers/page")

const router = Router()

router.post("/api/pages/:pageId", authorized(BUILDER), controller.save)

module.exports = router
