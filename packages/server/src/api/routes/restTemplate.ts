import { auth } from "@budibase/backend-core"
import * as controller from "../controllers/restTemplate"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/rest-templates", controller.fetch)
  .post("/api/rest-templates", auth.adminOnly, controller.upload)
  .put("/api/rest-templates/:restTemplateId", auth.adminOnly, controller.update)
  .delete(
    "/api/rest-templates/:restTemplateId",
    auth.adminOnly,
    controller.destroy
  )
