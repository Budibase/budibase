import * as datasourceController from "../controllers/datasource"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { datasourceValidator } from "./utils/validators"
import { builderGroup, customEndpointGroups } from "./endpointGroups"

const authorizedGroup = customEndpointGroups.group(
  authorized(permissions.PermissionType.TABLE, permissions.PermissionLevel.READ)
)

builderGroup
  .get("/api/datasources", datasourceController.fetch)
  .post("/api/datasources/verify", datasourceController.verify)
  .post("/api/datasources/info", datasourceController.information)
  .post(
    "/api/datasources/:datasourceId/schema",
    datasourceController.buildSchemaFromSource
  )
  .post("/api/datasources", datasourceValidator(), datasourceController.save)
  .delete("/api/datasources/:datasourceId/:revId", datasourceController.destroy)
  .get(
    "/api/datasources/:datasourceId/schema/external",
    datasourceController.getExternalSchema
  )

authorizedGroup
  .get("/api/datasources/:datasourceId", datasourceController.find)
  .put("/api/datasources/:datasourceId", datasourceController.update)
