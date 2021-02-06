const Router = require("@koa/router")
const rowController = require("../controllers/row")
const authorized = require("../../middleware/authorized")
const usage = require("../../middleware/usageQuota")
const {
  PermissionLevels,
  PermissionTypes,
} = require("../../utilities/security/permissions")

const router = Router()

router
  .get(
    "/api/:tableId/:rowId/enrich",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.fetchEnrichedRow
  )
  .get(
    "/api/:tableId/rows",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.fetchTableRows
  )
  .get(
    "/api/:tableId/rows/:rowId",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.find
  )
  .post(
    "/api/:tableId/rows",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    rowController.save
  )
  .post(
    "/api/:tableId/rows/search",
    // authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.search
  )
  .patch(
    "/api/:tableId/rows/:id",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    rowController.patch
  )
  .post(
    "/api/:tableId/rows/validate",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    rowController.validate
  )
  .delete(
    "/api/:tableId/rows/:rowId/:revId",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    rowController.destroy
  )

module.exports = router
