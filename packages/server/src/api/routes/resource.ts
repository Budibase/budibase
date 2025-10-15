import { auth } from "@budibase/backend-core"
import Joi from "joi"
import * as controller from "../controllers/resource"
import { builderRoutes } from "./endpointGroups"

const duplicateRequestValidator = auth.joiValidator.body(
  Joi.object({
    toWorkspace: Joi.string().required(),
    resources: Joi.array().min(1).items(Joi.string()),
  }).unknown(false)
)

builderRoutes.get("/api/resources", controller.getResourceDependencies)
builderRoutes.post(
  "/api/resources/duplicate",
  duplicateRequestValidator,
  controller.duplicateResourceToWorkspace
)
