const Router = require("@koa/router")
const controller = require("../controllers/deploy")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router.post("/:appId/deploy", authorized(BUILDER), controller.deployApp)

module.exports = router
