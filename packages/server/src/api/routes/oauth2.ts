import Router from "@koa/router"
import { PermissionType } from "@budibase/types"
import authorized from "../../middleware/authorized"

import * as controller from "../controllers/oauth2"

const router: Router = new Router()

router.get("/api/oauth2", authorized(PermissionType.BUILDER), controller.fetch)

export default router
