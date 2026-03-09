import { middleware } from "@budibase/backend-core"
import Joi from "joi"
import { playbooksEnabled } from "../../middleware/playbooksEnabled"
import * as controller from "../controllers/playbook"
import { builderRoutes } from "./endpointGroups"

const baseSchema = {
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  color: Joi.string().optional().allow(""),
}

builderRoutes
  .get("/api/playbooks", playbooksEnabled, controller.fetch)
  .post("/api/playbooks/import", playbooksEnabled, controller.importBundle)
  .post(
    "/api/playbooks/:id/export",
    playbooksEnabled,
    middleware.joiValidator.body(
      Joi.object({
        encryptPassword: Joi.string().optional().allow(""),
      }),
      {
        allowUnknown: false,
      }
    ),
    controller.exportBundle
  )
  .post(
    "/api/playbooks",
    playbooksEnabled,
    middleware.joiValidator.body(Joi.object(baseSchema), {
      allowUnknown: false,
    }),
    controller.create
  )
  .put(
    "/api/playbooks/:id",
    playbooksEnabled,
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
  .delete("/api/playbooks/:id/:rev", playbooksEnabled, controller.remove)
