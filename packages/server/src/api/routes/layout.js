const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const controller = require("../controllers/layout")

const router = Router()

router.post("/api/layouts/:layoutId", authorized(BUILDER), controller.save)

module.exports = router
