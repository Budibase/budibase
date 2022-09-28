const Router = require("@koa/router")
const controller = require("../controllers/apikeys")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")

const router = new Router()

router
  .get("/api/keys", authorized(BUILDER), controller.fetch)
  .put("/api/keys/:key", authorized(BUILDER), controller.update)

module.exports = router
