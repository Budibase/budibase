import * as controller from "../controllers/deploy"
import { builderGroup } from "./endpointGroups"

builderGroup
  .get("/api/deployments", controller.fetchDeployments)
  .get("/api/deploy/status", controller.publishStatus)
  .get("/api/deploy/:deploymentId", controller.deploymentProgress)
