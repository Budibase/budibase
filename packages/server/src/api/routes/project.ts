import { middleware } from "@budibase/backend-core"
import {
  MAX_PROJECT_NAME_LENGTH,
  MAX_PROJECT_README_LENGTH,
} from "@budibase/types"
import Joi from "joi"
import {
  AppType,
  middleware as appInfoMiddleware,
} from "../../middleware/appInfo"
import * as controller from "../controllers/project"
import { builderRoutes } from "./endpointGroups"

const baseSchema = {
  name: Joi.string().max(MAX_PROJECT_NAME_LENGTH).required(),
  description: Joi.string().optional().allow(""),
  readme: Joi.string().max(MAX_PROJECT_README_LENGTH).optional().allow(""),
  color: Joi.string().optional().allow(""),
}

builderRoutes
  .get("/api/projects", controller.fetch)
  .post(
    "/api/projects/assignments/preview",
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
    middleware.joiValidator.body(
      Joi.object({
        resourceRev: Joi.string().required(),
        projectIds: Joi.array().items(Joi.string()).required(),
        dependencyIds: Joi.array().items(Joi.string()).required(),
        dependencyFingerprint: Joi.string().required(),
      }),
      { allowUnknown: false }
    ),
    controller.updateAssignment
  )
  .post(
    "/api/projects/import",
    controller.cleanupImportFiles,
    appInfoMiddleware({ appType: AppType.DEV }),
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
    middleware.joiValidator.body(
      Joi.object({
        encryptPassword: Joi.string().max(1024).optional().allow(""),
        includeRows: Joi.boolean().strict().optional(),
      }),
      {
        allowUnknown: false,
      }
    ),
    controller.exportBundle
  )
  .post(
    "/api/projects",
    middleware.joiValidator.body(Joi.object(baseSchema), {
      allowUnknown: false,
    }),
    controller.create
  )
  .put(
    "/api/projects/:id",
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
  .delete("/api/projects/:id/:rev", controller.remove)
