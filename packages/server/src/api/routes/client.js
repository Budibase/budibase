const Router = require("@koa/router")
const controller = require("../controllers/client")

const router = Router()

router.get("/api/client/id", controller.getClientId)

module.exports = router
