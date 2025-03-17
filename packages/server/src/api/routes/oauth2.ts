import Router from "@koa/router"
import { PermissionType } from "@budibase/types"
import authorized from "../../middleware/authorized"

import * as controller from "../controllers/oauth2"

const router: Router = new Router()

router.get("/api/oauth2", authorized(PermissionType.BUILDER), controller.fetch)
router.post(
  "/api/oauth2",
  authorized(PermissionType.BUILDER),
  controller.create
)
router.put(
  "/api/oauth2/:id",
  authorized(PermissionType.BUILDER),
  oAuth2ConfigValidator(),
  controller.edit
)

export default router
