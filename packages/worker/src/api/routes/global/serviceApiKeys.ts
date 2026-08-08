import Joi from "joi"
import { auth } from "@budibase/backend-core"
import { ServiceApiKeyAccessLevel } from "@budibase/types"
import * as controller from "../../controllers/global/serviceApiKeys"
import { adminRoutes } from "../endpointGroups"

const workspaceAccess = Joi.alternatives().try(
  Joi.object({ type: Joi.string().valid("all").required() }),
  Joi.object({
    type: Joi.string().valid("selected").required(),
    workspaceIds: Joi.array().items(Joi.string()).min(1).required(),
  })
)

const createValidation = auth.joiValidator.body(
  Joi.object({
    name: Joi.string().trim().min(1).required(),
    accessLevel: Joi.string()
      .valid(...Object.values(ServiceApiKeyAccessLevel))
      .required(),
    workspaceAccess: workspaceAccess.required(),
    tenantAdmin: Joi.boolean().required(),
  })
)

adminRoutes
  .get("/api/global/service-api-keys", controller.fetch)
  .post("/api/global/service-api-keys", createValidation, controller.create)
  .post("/api/global/service-api-keys/:id/revoke", controller.revoke)
