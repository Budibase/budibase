const Router = require("@koa/router")
const controller = require("../controllers/auth")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router.post("/api/authenticate", controller.authenticate)
// TODO: this is a hack simply to make sure builder has a cookie until auth reworked
router.post("/api/builder/login", authorized(BUILDER), controller.builderLogin)
// doesn't need authorization as can only fetch info about self
router.get("/api/self", controller.fetchSelf)

module.exports = router
