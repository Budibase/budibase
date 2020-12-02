const Router = require("@koa/router")
const controller = require("../controllers/permission")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router.get("/api/permissions", authorized(BUILDER), controller.fetch)

module.exports = router
