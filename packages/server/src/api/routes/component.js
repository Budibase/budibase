const Router = require("@koa/router")
const controller = require("../controllers/component")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/auth/permissions")

const router = Router()

router.get(
  "/api/:appId/components/definitions",
  authorized(BUILDER),
  controller.fetchAppComponentDefinitions
)

module.exports = router
