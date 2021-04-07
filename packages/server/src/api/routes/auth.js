const Router = require("@koa/router")
const controller = require("../controllers/auth")

const router = Router()

router.post("/api/authenticate", controller.authenticate)
// doesn't need authorization as can only fetch info about self
router.get("/api/self", controller.fetchSelf)

module.exports = router
