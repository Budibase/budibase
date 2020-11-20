const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const controller = require("../controllers/routing")

const router = Router()

// gets the full structure, not just the correct screen ID for your access level
router
  .get("/api/routing/client", controller.clientFetch)
  .get("/api/routing", authorized(BUILDER), controller.fetch)

module.exports = router
