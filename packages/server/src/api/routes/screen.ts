import * as controller from "../controllers/screen"
import { screenValidator, resourceNameValidator } from "./utils/validators"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/screens", controller.fetch)
  .post(
    "/api/screens",
    screenValidator(),
    resourceNameValidator(),
    controller.save
  )
  .delete("/api/screens/:screenId/:screenRev", controller.destroy)
  .post("/api/screens/usage/:sourceId", controller.usage)
