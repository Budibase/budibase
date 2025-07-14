import authorized from "../../../middleware/authorized"
import { auth, permissions } from "@budibase/backend-core"
import { customEndpointGroups } from "./custom"

export const publicGroup = customEndpointGroups.group()
publicGroup.lockMiddleware()

export const globalBuilderGroup = customEndpointGroups.group(
  authorized(permissions.GLOBAL_BUILDER)
)
globalBuilderGroup.lockMiddleware()

export const builderGroup = customEndpointGroups.group(
  authorized(permissions.BUILDER)
)
builderGroup.lockMiddleware()

export const creatorGroup = customEndpointGroups.group(
  authorized(permissions.CREATOR)
)
creatorGroup.lockMiddleware()

export const builderAdminGroup = customEndpointGroups.group(auth.builderOrAdmin)
builderAdminGroup.lockMiddleware()
