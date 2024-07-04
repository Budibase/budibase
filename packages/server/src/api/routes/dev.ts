import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import env from "../../environment"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/dev"

const router: Router = new Router()

function redirectPath(path: string) {
  router
    .get(`/api/${path}/:devPath(.*)`, controller.buildRedirectGet(path))
    .post(`/api/${path}/:devPath(.*)`, controller.buildRedirectPost(path))
    .delete(`/api/${path}/:devPath(.*)`, controller.buildRedirectDelete(path))
}

if (env.isDev() || env.isTest()) {
  redirectPath("global")
  redirectPath("system")
}

router
  .get(
    "/api/dev/version",
    authorized(permissions.BUILDER),
    controller.getBudibaseVersion
  )
  .delete(
    "/api/dev/:appId/lock",
    authorized(permissions.BUILDER),
    controller.clearLock
  )
  .post(
    "/api/dev/:appId/revert",
    authorized(permissions.BUILDER),
    controller.revert
  )

export default router
