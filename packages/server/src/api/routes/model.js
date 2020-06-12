const Router = require("@koa/router")
const modelController = require("../controllers/model")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/:instanceId/models", authorized(BUILDER), modelController.fetch)
  .get("/api/:instanceId/models/:id", authorized(BUILDER), modelController.find)
  .post("/api/:instanceId/models", authorized(BUILDER), modelController.create)
  // .patch("/api/:instanceId/models", controller.update)
  .delete(
    "/api/:instanceId/models/:modelId/:revId",
    authorized(BUILDER),
    modelController.destroy
  )

module.exports = router
