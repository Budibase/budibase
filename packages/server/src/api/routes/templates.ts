import * as controller from "../controllers/templates"
import { builderGroup } from "./endpointGroups"

builderGroup
  .get("/api/templates", controller.fetch)
  .get("/api/templates/:type/:name", controller.downloadTemplate)
