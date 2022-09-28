const Router = require("@koa/router")
const controller = require("../controllers/role")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")
const { roleValidator } = require("./utils/validators")

const router = new Router()

router
  .post("/api/roles", authorized(BUILDER), roleValidator(), controller.save)
  .get("/api/roles", authorized(BUILDER), controller.fetch)
  .get("/api/roles/:roleId", authorized(BUILDER), controller.find)
  .delete("/api/roles/:roleId/:rev", authorized(BUILDER), controller.destroy)

module.exports = router
