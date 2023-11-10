import Router from "@koa/router"
import * as controller from "../controllers/deploy"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get(
    "/api/deployments",
    authorized(permissions.BUILDER),
    controller.fetchDeployments
  )
  .get(
    "/api/deploy/:deploymentId",
    authorized(permissions.BUILDER),
    controller.deploymentProgress
  )

export default router
