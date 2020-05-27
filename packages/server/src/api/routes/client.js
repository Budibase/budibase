const Router = require("@koa/router")
const controller = require("../controllers/client")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router.get("/api/client/id", authorized(BUILDER), controller.getClientId)

module.exports = router
