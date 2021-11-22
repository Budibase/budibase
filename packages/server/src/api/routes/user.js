const Router = require("@koa/router")
const controller = require("../controllers/user")
const authorized = require("../../middleware/authorized")
const {
  PermissionLevels,
  PermissionTypes,
} = require("@budibase/auth/permissions")

const router = Router()

router
  .get(
    "/api/users/metadata",
    authorized(PermissionTypes.USER, PermissionLevels.READ),
    controller.fetchMetadata
  )
  .get(
    "/api/users/metadata/:id",
    authorized(PermissionTypes.USER, PermissionLevels.READ),
    controller.findMetadata
  )
  .put(
    "/api/users/metadata",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    controller.updateMetadata
  )
  .post(
    "/api/users/metadata/self",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    controller.updateSelfMetadata
  )
  .delete(
    "/api/users/metadata/:id",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    controller.destroyMetadata
  )
  .post(
    "/api/users/metadata/sync/:id",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    controller.syncUser
  )

module.exports = router
