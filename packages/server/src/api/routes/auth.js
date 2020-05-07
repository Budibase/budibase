const Router = require("@koa/router")
const controller = require("../controllers/auth")

const router = Router()

router.post("/api/authenticate", controller.authenticate)

module.exports = router
