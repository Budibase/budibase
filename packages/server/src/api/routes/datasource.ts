import * as datasourceController from "../controllers/datasource"
import { datasourceValidator } from "./utils/validators"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/datasources", datasourceController.fetch)
  .post("/api/datasources/verify", datasourceController.verify)
  .post("/api/datasources/info", datasourceController.information)
  .post("/api/datasources/views", datasourceController.viewInformation)
  .post(
    "/api/datasources/relationships",
    datasourceController.getRelationshipInformation
  )
  .post(
    "/api/datasources/:datasourceId/schema",
    datasourceController.buildSchemaFromSource
  )
  .get("/api/datasources/:datasourceId", datasourceController.find)
  .put("/api/datasources/:datasourceId", datasourceController.update)
  .post("/api/datasources", datasourceValidator(), datasourceController.save)
  .delete("/api/datasources/:datasourceId/:revId", datasourceController.destroy)
