import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import {
  AppType,
  middleware as appInfoMiddleware,
} from "../../middleware/appInfo"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/metadata"

const router: Router = new Router()

router
  .post(
    "/api/metadata/:type/:entityId",
    authorized(permissions.BUILDER),
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.saveMetadata
  )
  .delete(
    "/api/metadata/:type/:entityId",
    authorized(permissions.BUILDER),
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.deleteMetadata
  )
  .get(
    "/api/metadata/type",
    authorized(permissions.BUILDER),
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.getTypes
  )
  .get(
    "/api/metadata/:type/:entityId",
    authorized(permissions.BUILDER),
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.getMetadata
  )

export default router
