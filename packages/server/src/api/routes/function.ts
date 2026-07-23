import Joi from "joi"
import { middleware } from "@budibase/backend-core"
import { DEFAULT_FUNCTION_LIMITS } from "@budibase/types"
import { functionsEnabled } from "../../middleware/functionsEnabled"
import * as controller from "../controllers/function"
import { builderRoutes } from "./endpointGroups"

const capabilitySchema = Joi.object({
  queryId: Joi.string().required(),
  datasourceAlias: Joi.string().max(128).required(),
  queryAlias: Joi.string().max(128).required(),
})

const draftSchema = {
  name: Joi.string().max(255).required(),
  source: Joi.string()
    .max(DEFAULT_FUNCTION_LIMITS.compile.maxSourceBytes)
    .required()
    .allow(""),
  capabilities: Joi.array().items(capabilitySchema).required(),
}

builderRoutes
  .get("/api/functions", functionsEnabled, controller.fetch)
  .post(
    "/api/functions",
    functionsEnabled,
    middleware.joiValidator.body(Joi.object(draftSchema), {
      allowUnknown: false,
    }),
    controller.create
  )
  .post(
    "/api/functions/compile",
    functionsEnabled,
    middleware.joiValidator.body(
      Joi.object({
        ...draftSchema,
        functionId: Joi.string().optional(),
      }),
      { allowUnknown: false }
    ),
    controller.compile
  )
  .get(
    "/api/functions/query-catalog",
    functionsEnabled,
    controller.queryCatalog
  )
  .get("/api/functions/:id", functionsEnabled, controller.find)
  .post(
    "/api/functions/:id/build",
    functionsEnabled,
    middleware.joiValidator.body(
      Joi.object({
        _rev: Joi.string().required(),
      }),
      { allowUnknown: false }
    ),
    controller.build
  )
  .put(
    "/api/functions/:id",
    functionsEnabled,
    middleware.joiValidator.body(
      Joi.object({
        _rev: Joi.string().required(),
        ...draftSchema,
      }),
      { allowUnknown: false }
    ),
    controller.update
  )
  .delete("/api/functions/:id/:rev", functionsEnabled, controller.remove)
