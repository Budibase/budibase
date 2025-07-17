import * as controller from "../controllers/layout"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .post("/api/layouts", controller.save)
  .delete("/api/layouts/:layoutId/:layoutRev", controller.destroy)
