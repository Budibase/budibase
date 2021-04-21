const Router = require("@koa/router")
const controller = require("../controllers/app")

const router = Router()

router.get("/api/apps", controller.getApps)

module.exports = router
