import * as controller from "../controllers/screen"
import { screenValidator } from "./utils/validators"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/screens", controller.fetch)
  .post("/api/screens", screenValidator(), controller.save)
  .delete("/api/screens/:screenId/:screenRev", controller.destroy)
  .post("/api/screens/usage/:sourceId", controller.usage)
