import Router from "@koa/router"
import * as controller from "../controllers/cloud"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get(
    "/api/cloud/export",
    authorized(permissions.BUILDER),
    controller.exportApps
  )
  // has to be public, only run if apps don't exist
  .post("/api/cloud/import", controller.importApps)
  .get("/api/cloud/import/complete", controller.hasBeenImported)

export default router
