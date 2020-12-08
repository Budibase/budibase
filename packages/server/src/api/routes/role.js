const Router = require("@koa/router")
const controller = require("../controllers/role")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router
  .post("/api/roles", authorized(BUILDER), controller.save)
  .get("/api/roles", authorized(BUILDER), controller.fetch)
  .get("/api/roles/:roleId", authorized(BUILDER), controller.find)
  .delete("/api/roles/:roleId/:rev", authorized(BUILDER), controller.destroy)

module.exports = router
