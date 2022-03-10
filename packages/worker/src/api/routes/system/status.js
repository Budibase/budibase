const Router = require("@koa/router")
const controller = require("../../controllers/system/status")

const router = Router()

router.get("/api/system/status", controller.fetch)

module.exports = router
