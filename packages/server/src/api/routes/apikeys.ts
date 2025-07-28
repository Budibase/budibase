import * as controller from "../controllers/apikeys"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/keys", controller.fetch)
  .put("/api/keys/:key", controller.update)
