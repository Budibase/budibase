const Router = require("@koa/router")
const controller = require("../controllers/user")
const authorized = require("../../middleware/authorized")
const {
  PermissionLevels,
  PermissionTypes,
} = require("../../utilities/security/permissions")
const usage = require("../../middleware/usageQuota")

const router = Router()

router
  .get(
    "/api/users",
    authorized(PermissionTypes.USER, PermissionLevels.READ),
    controller.fetch
  )
  .get(
    "/api/users/:username",
    authorized(PermissionTypes.USER, PermissionLevels.READ),
    controller.find
  )
  .put(
    "/api/users/",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    controller.update
  )
  .post(
    "/api/users",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    usage,
    controller.create
  )
  .delete(
    "/api/users/:username",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    usage,
    controller.destroy
  )

module.exports = router
