import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/backup"

const router: Router = new Router()

router.post(
  "/api/backups/export",
  authorized(permissions.BUILDER),
  controller.exportAppDump
)

export default router
