const Router = require("@koa/router")
const controller = require("../controllers/workflow")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/:instanceId/workflows", authorized(BUILDER), controller.fetch)
  .get("/api/:instanceId/workflows/:id", authorized(BUILDER), controller.find)
  .post("/api/:instanceId/workflows", authorized(BUILDER), controller.create)
  .put("/api/:instanceId/workflows", authorized(BUILDER), controller.update)
  .delete(
    "/api/:instanceId/workflows/:id/:rev",
    authorized(BUILDER),
    controller.destroy
  )

module.exports = router
