const Router = require("@koa/router")
const recordController = require("../controllers/record")
const authorized = require("../../middleware/authorized")
const { READ_MODEL, WRITE_MODEL } = require("../../utilities/accessLevels")

const router = Router()

router
  .get(
    "/api/:instanceId/:modelId/records",
    authorized(READ_MODEL, ctx => ctx.params.modelId),
    recordController.fetchModelRecords
  )
  .get(
    "/api/:instanceId/:modelId/records/:recordId",
    authorized(READ_MODEL, ctx => ctx.params.modelId),
    recordController.find
  )
  .post("/api/:instanceId/records/search", recordController.search)
  .post(
    "/api/:instanceId/:modelId/records",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.save
  )
  .post(
    "/api/:instanceId/:modelId/records/validate",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.validate
  )
  .delete(
    "/api/:instanceId/:modelId/records/:recordId/:revId",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.destroy
  )

module.exports = router
