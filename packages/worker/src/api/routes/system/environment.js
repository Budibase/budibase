const Router = require("@koa/router")
const controller = require("../../controllers/system/environment")

const router = Router()

router.get("/api/system/environment", controller.fetch)

module.exports = router
