const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const controller = require("../controllers/routing")

const router = Router()

router
  // gets correct structure for user role
  .get("/api/routing/client", controller.clientFetch)
  // gets the full structure, not just the correct screen ID for user role
  .get("/api/routing", authorized(BUILDER), controller.fetch)

module.exports = router
