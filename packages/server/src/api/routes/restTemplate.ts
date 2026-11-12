import * as controller from "../controllers/restTemplate"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/rest-templates", controller.fetch)
  .post("/api/rest-templates", controller.upload)
  .put("/api/rest-templates/:restTemplateId", controller.update)
  .delete("/api/rest-templates/:restTemplateId", controller.destroy)
