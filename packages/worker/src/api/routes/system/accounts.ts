import Router from "@koa/router"
import * as controller from "../../controllers/system/accounts"
import { middleware } from "@budibase/backend-core"

const router: Router = new Router()

router
  .put(
    "/api/system/accounts/:accountId/metadata",
    middleware.internalApi,
    controller.save
  )
  .delete(
    "/api/system/accounts/:accountId/metadata",
    middleware.internalApi,
    controller.destroy
  )

export default router
