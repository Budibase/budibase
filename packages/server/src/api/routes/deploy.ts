import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import authorized from "../../middleware/authorized"
import * as controller from "../controllers/deploy"

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
