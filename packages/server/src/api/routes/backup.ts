import Router from "@koa/router"
import * as controller from "../controllers/backup"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import ensureTenantAppOwnership from "../../middleware/ensureTenantAppOwnership"

const router: Router = new Router()

router.post(
  "/api/backups/export",
  authorized(permissions.BUILDER),
  ensureTenantAppOwnership((ctx: UserCtx) => ctx.query.appId as string),
  controller.exportAppDump
)

export default router
