import authorized from "../../../middleware/authorized"
import { auth, permissions } from "@budibase/backend-core"
import { customEndpointGroups } from "./custom"

export const globalBuilderRoutes = customEndpointGroups.group(
  authorized(permissions.GLOBAL_BUILDER)
)
globalBuilderRoutes.lockMiddleware()

export const builderRoutes = customEndpointGroups.group(
  authorized(permissions.BUILDER)
)
builderRoutes.lockMiddleware()

export const creatorRoutes = customEndpointGroups.group(
  authorized(permissions.CREATOR)
)
creatorRoutes.lockMiddleware()

export const builderAdminRoutes = customEndpointGroups.group(
  auth.builderOrAdmin
)
builderAdminRoutes.lockMiddleware()

export const publicRoutes = customEndpointGroups.group()
publicRoutes.lockMiddleware()
