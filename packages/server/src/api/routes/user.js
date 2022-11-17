const Router = require("@koa/router")
const controller = require("../controllers/user")
const authorized = require("../../middleware/authorized")
const {
  PermissionLevel,
  PermissionType,
} = require("@budibase/backend-core/permissions")

const router = new Router()

router
  .get(
    "/api/users/metadata",
    authorized(PermissionType.USER, PermissionLevel.READ),
    controller.fetchMetadata
  )
  .get(
    "/api/users/metadata/:id",
    authorized(PermissionType.USER, PermissionLevel.READ),
    controller.findMetadata
  )
  .put(
    "/api/users/metadata",
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.updateMetadata
  )
  .post(
    "/api/users/metadata/self",
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.updateSelfMetadata
  )
  .delete(
    "/api/users/metadata/:id",
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.destroyMetadata
  )
  .post(
    "/api/users/metadata/sync/:id",
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.syncUser
  )
  .post(
    "/api/users/flags",
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.setFlag
  )
  .get(
    "/api/users/flags",
    authorized(PermissionType.USER, PermissionLevel.READ),
    controller.getFlags
  )

module.exports = router
