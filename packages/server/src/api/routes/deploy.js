const Router = require("@koa/router")
const controller = require("../controllers/deploy")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

// router.post("/:appId/deploy", authorized(BUILDER), controller.deployApp)
router.post("/deploy", controller.deployApp)

module.exports = router
