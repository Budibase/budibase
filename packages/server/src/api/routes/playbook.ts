import { middleware } from "@budibase/backend-core"
import Joi from "joi"
import * as controller from "../controllers/playbook"
import { builderRoutes } from "./endpointGroups"

const baseSchema = {
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  color: Joi.string().optional().allow(""),
}

builderRoutes
  .get("/api/playbooks", controller.fetch)
  .post(
    "/api/playbooks",
    middleware.joiValidator.body(Joi.object(baseSchema), {
      allowUnknown: false,
    }),
    controller.create
  )
  .put(
    "/api/playbooks/:id",
    middleware.joiValidator.body(
      Joi.object({
        _id: Joi.string().required(),
        _rev: Joi.string().required(),
        ...baseSchema,
      }),
      {
        allowUnknown: false,
      }
    ),
    controller.update
  )
  .delete("/api/playbooks/:id/:rev", controller.remove)
