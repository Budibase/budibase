import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/user"

const { PermissionType, PermissionLevel } = permissions

const router: Router = new Router()

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
    "/api/users/flags",
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.setFlag
  )
  .get(
    "/api/users/flags",
    authorized(PermissionType.USER, PermissionLevel.READ),
    controller.getFlags
  )

export default router
