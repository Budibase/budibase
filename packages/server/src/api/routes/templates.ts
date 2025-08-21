import * as controller from "../controllers/templates"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/templates", controller.fetch)
  .get("/api/templates/:type/:name", controller.downloadTemplate)
