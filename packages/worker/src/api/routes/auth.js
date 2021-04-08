const Router = require("@koa/router")
const authController = require("../controllers/auth")

const router = Router()

router.post("/api/auth/authenticate", authController.authenticate)

module.exports = router
