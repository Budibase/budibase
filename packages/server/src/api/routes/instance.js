const Router = require("@koa/router")
const controller = require("../controllers/instance")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router
  .post("/api/:applicationId/instances", authorized(BUILDER), controller.create)
  .delete("/api/instances/:instanceId", authorized(BUILDER), controller.destroy)

module.exports = router
