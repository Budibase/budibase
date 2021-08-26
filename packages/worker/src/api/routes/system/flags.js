const Router = require("@koa/router")
const controller = require("../../controllers/system/flags")

const router = Router()

router.get("/api/system/flags", controller.fetch)

module.exports = router
