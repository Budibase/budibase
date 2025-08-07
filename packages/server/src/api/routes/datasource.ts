import * as datasourceController from "../controllers/datasource"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { datasourceValidator } from "./utils/validators"
import recaptcha from "../../middleware/recaptcha"
import { builderRoutes, endpointGroupList } from "./endpointGroups"

const authorizedRoutes = endpointGroupList.group(
  {
    middleware: authorized(
      permissions.PermissionType.TABLE,
      permissions.PermissionLevel.READ
    ),
    first: false,
  },
  recaptcha
)

builderRoutes
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

authorizedRoutes
  .get("/api/datasources/:datasourceId", datasourceController.find)
  .put("/api/datasources/:datasourceId", datasourceController.update)
