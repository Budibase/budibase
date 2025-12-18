import * as controller from "../controllers/plugin"
import { globalBuilderRoutes } from "./endpointGroups"

globalBuilderRoutes
  .post("/api/plugin/upload", controller.upload)
  .post("/api/plugin", controller.create)
  .get("/api/plugin", controller.fetch)
  .delete("/api/plugin/:pluginId", controller.destroy)
