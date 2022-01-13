const Router = require("@koa/router")
const controller = require("../controllers/script")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")

const router = Router()

router.post("/api/script", authorized(BUILDER), controller.save)

module.exports = router
