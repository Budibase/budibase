const Router = require("@koa/router")
const tableController = require("../controllers/table")
const authorized = require("../../middleware/authorized")
const { BUILDER, READ_TABLE } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/tables", authorized(BUILDER), tableController.fetch)
  .get(
    "/api/tables/:id",
    authorized(READ_TABLE, ctx => ctx.params.id),
    tableController.find
  )
  .post("/api/tables", authorized(BUILDER), tableController.save)
  .post(
    "/api/tables/csv/validate",
    authorized(BUILDER),
    tableController.validateCSVSchema
  )
  .delete(
    "/api/tables/:tableId/:revId",
    authorized(BUILDER),
    tableController.destroy
  )

module.exports = router
