const Router = require("@koa/router")
const controller = require("../controllers/workflow")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/workflows/trigger/list", authorized(BUILDER), controller.getTriggerList)
  .get("/api/workflows/action/list", authorized(BUILDER), controller.getActionList)
  .get("/api/workflows/logic/list", authorized(BUILDER), controller.getLogicList)
  .get("/api/workflows", authorized(BUILDER), controller.fetch)
  .get("/api/workflows/:id", authorized(BUILDER), controller.find)
  .get("/api/workflows/:id/:action", authorized(BUILDER), controller.fetchActionScript)
  .put("/api/workflows", authorized(BUILDER), controller.update)
  .post("/api/workflows", authorized(BUILDER), controller.create)
  .post("/api/workflows/trigger", controller.trigger)
  .delete("/api/workflows/:id/:rev", authorized(BUILDER), controller.destroy)

module.exports = router
