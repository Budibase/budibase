const Router = require("@koa/router")
const controller = require("../controllers/app")
const checkKey = require("../../middleware/check-key")

const router = Router()

router.get("/api/apps", checkKey, controller.getApps)

module.exports = router
