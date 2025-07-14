import * as controller from "../controllers/layout"
import { builderGroup } from "./endpointGroups"

builderGroup
  .post("/api/layouts", controller.save)
  .delete("/api/layouts/:layoutId/:layoutRev", controller.destroy)
