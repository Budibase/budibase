const Router = require("@koa/router")
const controller = require("../controllers/apikeys")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router
  .get("/api/keys", authorized(BUILDER), controller.fetch)
  .put("/api/keys/:key", authorized(BUILDER), controller.update)

module.exports = router
