const Router = require("@koa/router")
const controller = require("../controllers/app")
const authenticated = require("../../middleware/authenticated")

const router = Router()

router.get("/api/apps", authenticated, controller.getApps)

module.exports = router
