const Router = require("@koa/router")
const recordController = require("../controllers/record")
const authorized = require("../../middleware/authorized")
const { READ_MODEL, WRITE_MODEL } = require("../../utilities/accessLevels")

const router = Router()

router
  .get(
    "/api/:modelId/:recordId/:fieldName/links",
    authorized(READ_MODEL, ctx => ctx.params.modelId),
    recordController.fetchLinkedRecords
  )
  .get(
    "/api/:modelId/:recordId/links",
    authorized(READ_MODEL, ctx => ctx.params.modelId),
    recordController.fetchLinkedRecords
  )
  .get(
    "/api/:modelId/records",
    authorized(READ_MODEL, ctx => ctx.params.modelId),
    recordController.fetchModelRecords
  )
  .get(
    "/api/:modelId/records/:recordId",
    authorized(READ_MODEL, ctx => ctx.params.modelId),
    recordController.find
  )
  .post("/api/records/search", recordController.search)
  .post(
    "/api/:modelId/records",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.save
  )
  .patch(
    "/api/:modelId/records/:id",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.patch
  )
  .post(
    "/api/:modelId/records/validate",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.validate
  )
  .delete(
    "/api/:modelId/records/:recordId/:revId",
    authorized(WRITE_MODEL, ctx => ctx.params.modelId),
    recordController.destroy
  )

module.exports = router
