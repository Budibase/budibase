import Router from "@koa/router"
import * as controller from "../controllers/user"
import authorized from "../../middleware/authorized"
import recaptcha from "../../middleware/recaptcha"
import { permissions } from "@budibase/backend-core"

const { PermissionType, PermissionLevel } = permissions

const router: Router = new Router()

router
  .get(
    "/api/users/metadata",
    recaptcha,
    authorized(PermissionType.USER, PermissionLevel.READ),
    controller.fetchMetadata
  )
  .get(
    "/api/users/metadata/:id",
    recaptcha,
    authorized(PermissionType.USER, PermissionLevel.READ),
    controller.findMetadata
  )
  .put(
    "/api/users/metadata",
    recaptcha,
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.updateMetadata
  )
  .post(
    "/api/users/metadata/self",
    recaptcha,
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.updateSelfMetadata
  )
  .delete(
    "/api/users/metadata/:id",
    recaptcha,
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.destroyMetadata
  )
  .post(
    "/api/users/flags",
    recaptcha,
    authorized(PermissionType.USER, PermissionLevel.WRITE),
    controller.setFlag
  )
  .get(
    "/api/users/flags",
    recaptcha,
    authorized(PermissionType.USER, PermissionLevel.READ),
    controller.getFlags
  )

export default router
