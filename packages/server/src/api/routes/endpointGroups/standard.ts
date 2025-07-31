import { authorizedMiddleware as authorized } from "../../../middleware/authorized"
import { auth, EndpointGroupList, permissions } from "@budibase/backend-core"

export const endpointGroupList = new EndpointGroupList()

export const globalBuilderRoutes = endpointGroupList.group(
  authorized(permissions.GLOBAL_BUILDER)
)
globalBuilderRoutes.lockMiddleware()

export const builderRoutes = endpointGroupList.group(
  authorized(permissions.BUILDER)
)
builderRoutes.lockMiddleware()

export const creatorRoutes = endpointGroupList.group(
  authorized(permissions.CREATOR)
)
creatorRoutes.lockMiddleware()

export const builderAdminRoutes = endpointGroupList.group(auth.builderOrAdmin)
builderAdminRoutes.lockMiddleware()

export const publicRoutes = endpointGroupList.group()
publicRoutes.lockMiddleware()
