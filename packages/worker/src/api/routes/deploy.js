const Router = require("@koa/router")
const controller = require("../controllers/deploy")
const checkKey = require("../../middleware/check-key")

const router = Router()

router.post("/api/deploy", checkKey, controller.deploy)

module.exports = router
