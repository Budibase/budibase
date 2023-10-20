import Router from "@koa/router"
import * as controller from "../controllers/backup"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router.post(
  "/api/backups/export",
  authorized(permissions.BUILDER),
  controller.exportAppDump
)

export default router
