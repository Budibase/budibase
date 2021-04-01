const Router = require("@koa/router")
const controller = require("../controllers/search")
const {
  PermissionTypes,
  PermissionLevels,
} = require("../../utilities/security/permissions")
const authorized = require("../../middleware/authorized")
const { paramResource } = require("../../middleware/resourceId")

const router = Router()

router.post(
  "/api/search/:tableId/rows",
  paramResource("tableId"),
  authorized(PermissionTypes.TABLE, PermissionLevels.READ),
  controller.rowSearch
)

module.exports = router
