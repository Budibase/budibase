import { middleware } from "@budibase/backend-core"
import Joi from "joi"
import { projectsEnabled } from "../../middleware/projectsEnabled"
import * as controller from "../controllers/project"
import { builderRoutes } from "./endpointGroups"

const baseSchema = {
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  color: Joi.string().optional().allow(""),
}

builderRoutes
  .get("/api/projects", projectsEnabled, controller.fetch)
  .post(
    "/api/projects/assignments/preview",
    projectsEnabled,
    middleware.joiValidator.body(
      Joi.object({
        resourceId: Joi.string().required(),
        projectIds: Joi.array().items(Joi.string()).required(),
      }),
      { allowUnknown: false }
    ),
    controller.previewAssignment
  )
  .put(
    "/api/projects/assignments/:resourceId",
    projectsEnabled,
    middleware.joiValidator.body(
      Joi.object({
        resourceRev: Joi.string().required(),
        projectIds: Joi.array().items(Joi.string()).required(),
        dependencyIds: Joi.array().items(Joi.string()).required(),
      }),
      { allowUnknown: false }
    ),
    controller.updateAssignment
  )
  .post(
    "/api/projects/import",
    projectsEnabled,
    middleware.joiValidator.body(
      Joi.object({
        encryptPassword: Joi.string().max(1024).optional().allow(""),
      }),
      {
        allowUnknown: false,
      }
    ),
    controller.importBundle
  )
  .post(
    "/api/projects/:id/export",
    projectsEnabled,
    middleware.joiValidator.body(
      Joi.object({
        encryptPassword: Joi.string().max(1024).optional().allow(""),
      }),
      {
        allowUnknown: false,
      }
    ),
    controller.exportBundle
  )
  .post(
    "/api/projects",
    projectsEnabled,
    middleware.joiValidator.body(Joi.object(baseSchema), {
      allowUnknown: false,
    }),
    controller.create
  )
  .put(
    "/api/projects/:id",
    projectsEnabled,
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
  .delete("/api/projects/:id/:rev", projectsEnabled, controller.remove)
