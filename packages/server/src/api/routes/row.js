const Router = require("@koa/router")
const rowController = require("../controllers/row")
const authorized = require("../../middleware/authorized")
const usage = require("../../middleware/usageQuota")
const { READ_TABLE, WRITE_TABLE } = require("../../utilities/accessLevels")

const router = Router()

router
  .get(
    "/api/:tableId/:rowId/enrich",
    authorized(READ_TABLE, ctx => ctx.params.tableId),
    rowController.fetchEnrichedRow
  )
  .get(
    "/api/:tableId/rows",
    authorized(READ_TABLE, ctx => ctx.params.tableId),
    rowController.fetchTableRows
  )
  .get(
    "/api/:tableId/rows/:rowId",
    authorized(READ_TABLE, ctx => ctx.params.tableId),
    rowController.find
  )
  .post("/api/rows/search", rowController.search)
  .post(
    "/api/:tableId/rows",
    authorized(WRITE_TABLE, ctx => ctx.params.tableId),
    usage,
    rowController.save
  )
  .patch(
    "/api/:tableId/rows/:id",
    authorized(WRITE_TABLE, ctx => ctx.params.tableId),
    rowController.patch
  )
  .post(
    "/api/:tableId/rows/validate",
    authorized(WRITE_TABLE, ctx => ctx.params.tableId),
    rowController.validate
  )
  .delete(
    "/api/:tableId/rows/:rowId/:revId",
    authorized(WRITE_TABLE, ctx => ctx.params.tableId),
    usage,
    rowController.destroy
  )

module.exports = router
