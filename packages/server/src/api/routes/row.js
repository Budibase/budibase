const Router = require("@koa/router")
const rowController = require("../controllers/row")
const authorized = require("../../middleware/authorized")
const usage = require("../../middleware/usageQuota")
const {
  paramResource,
  paramSubResource,
} = require("../../middleware/resourceId")
const {
  PermissionLevels,
  PermissionTypes,
} = require("../../utilities/security/permissions")

const router = Router()

router
  .get(
    "/api/:tableId/:rowId/enrich",
    paramSubResource("tableId", "rowId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.fetchEnrichedRow
  )
  .get(
    "/api/:tableId/rows",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.fetchTableRows
  )
  .get(
    "/api/:tableId/rows/:rowId",
    paramSubResource("tableId", "rowId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.find
  )
  .post(
    "/api/:tableId/rows",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    rowController.save
  )
  .patch(
    "/api/:tableId/rows/:rowId",
    paramSubResource("tableId", "rowId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    rowController.patch
  )
  .post(
    "/api/:tableId/rows/validate",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    rowController.validate
  )
  .delete(
    "/api/:tableId/rows/:rowId/:revId",
    paramSubResource("tableId", "rowId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    rowController.destroy
  )

module.exports = router
