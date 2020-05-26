const Router = require("@koa/router")
const modelController = require("../controllers/model")
const recordController = require("../controllers/record")
const authorized = require("../../middleware/authorized")
const {
  READ_MODEL,
  WRITE_MODEL,
  BUILDER,
} = require("../../utilities/accessLevels")

const router = Router()

// records

router
  .get(
    "/api/:instanceId/:modelId/records",
    authorized(READ_MODEL, ctx => ctx.params.modelId),
    recordController.fetchModel
  )
  .get(
    "/api/:instanceId/:modelId/records/:recordId",
    authorized(READ_MODEL, ctx => ctx.params.modelId),
    recordController.find
  )
  .post(
    "/api/:instanceId/:modelId/records",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.save
  )
  .delete(
    "/api/:instanceId/:modelId/records/:recordId/:revId",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.destroy
  )

// models

router
  .get("/api/:instanceId/models", authorized(BUILDER), modelController.fetch)
  .post("/api/:instanceId/models", authorized(BUILDER), modelController.create)
  // .patch("/api/:instanceId/models", controller.update)
  .delete(
    "/api/:instanceId/models/:modelId/:revId",
    authorized(BUILDER),
    modelController.destroy
  )

module.exports = router
