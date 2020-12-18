const Router = require("@koa/router")
const controller = require("../controllers/integration")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router
  .get("/api/integrations", authorized(BUILDER), controller.fetch)
  .get("/api/integrations/:type", authorized(BUILDER), controller.find)

module.exports = router
