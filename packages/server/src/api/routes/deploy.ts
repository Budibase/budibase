import * as controller from "../controllers/deploy"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/deployments", controller.fetchDeployments)
  .get("/api/deploy/status", controller.publishStatus)
  .get("/api/deploy/:deploymentId", controller.deploymentProgress)
