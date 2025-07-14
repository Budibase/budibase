import * as controller from "../controllers/apikeys"
import { builderGroup } from "./endpointGroups"

builderGroup
  .get("/api/keys", controller.fetch)
  .put("/api/keys/:key", controller.update)
