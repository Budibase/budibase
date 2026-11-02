import { db as dbCore } from "@budibase/backend-core"
import * as controller from "../controllers/role"
import { roleValidator, resourceNameValidator } from "./utils/validators"
import { publicRoutes, builderRoutes } from "./endpointGroups"

// retrieve a list of the roles a user can access
// needs to be public for public screens
publicRoutes.get("/api/roles/accessible", controller.accessible)
builderRoutes
  .post(
    "/api/roles",
    roleValidator(),
    resourceNameValidator({
      getResourceId: ctx =>
        ctx.request.body._id && dbCore.prefixRoleID(ctx.request.body._id),
    }),
    resourceNameValidator({
      getName: resource => resource.uiMetadata?.displayName,
      getResourceId: ctx =>
        ctx.request.body._id && dbCore.prefixRoleID(ctx.request.body._id),
    }),
    controller.save
  )
  .get("/api/roles", controller.fetch)
  .get("/api/roles/:roleId", controller.find)
  .delete("/api/roles/:roleId/:rev", controller.destroy)
