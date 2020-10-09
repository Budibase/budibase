const Router = require("@koa/router")
const recordController = require("../controllers/record")
const authorized = require("../../middleware/authorized")
const usage = require("../../middleware/usageQuota")
const { READ_TABLE, WRITE_TABLE } = require("../../utilities/accessLevels")

const router = Router()

router
  .get(
    "/api/:tableId/:recordId/enrich",
    authorized(READ_TABLE, ctx => ctx.params.tableId),
    recordController.fetchEnrichedRecord
  )
  .get(
    "/api/:tableId/records",
    authorized(READ_TABLE, ctx => ctx.params.tableId),
    recordController.fetchTableRecords
  )
  .get(
    "/api/:tableId/records/:recordId",
    authorized(READ_TABLE, ctx => ctx.params.tableId),
    recordController.find
  )
  .post("/api/records/search", recordController.search)
  .post(
    "/api/:tableId/records",
    authorized(WRITE_TABLE, ctx => ctx.params.tableId),
    usage,
    recordController.save
  )
  .patch(
    "/api/:tableId/records/:id",
    authorized(WRITE_TABLE, ctx => ctx.params.tableId),
    recordController.patch
  )
  .post(
    "/api/:tableId/records/validate",
    authorized(WRITE_TABLE, ctx => ctx.params.tableId),
    recordController.validate
  )
  .delete(
    "/api/:tableId/records/:recordId/:revId",
    authorized(WRITE_TABLE, ctx => ctx.params.tableId),
    usage,
    recordController.destroy
  )

module.exports = router
