import { middleware } from "@budibase/backend-core"
import * as controller from "../controllers/workspaceFavourites"
import { builderRoutes } from "./endpointGroups"
import Joi from "joi"
import { WorkspaceResource } from "@budibase/types"

function workspaceFavouriteValidator(schema: typeof insertSchema) {
  return middleware.joiValidator.body(schema, { allowUnknown: false })
}

const baseSchema = {
  resourceType: Joi.string().valid(...Object.values(WorkspaceResource)),
  resourceId: Joi.string().optional(),
}

const insertSchema = Joi.object({
  ...baseSchema,
})

builderRoutes
  .get("/api/workspace/favourites", controller.fetch)
  .post(
    "/api/workspace/favourites",
    workspaceFavouriteValidator(insertSchema),
    controller.create
  )
  .delete("/api/workspace/favourites/:id/:rev", controller.destroy)
