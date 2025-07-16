import { customEndpointGroups } from "./custom"
import cloudRestricted from "../../../middleware/cloudRestricted"
import { auth } from "@budibase/backend-core"

export const builderOrAdminRoutes = customEndpointGroups.group(
  auth.builderOrAdmin
)
builderOrAdminRoutes.lockMiddleware()

export const adminRoutes = customEndpointGroups.group(auth.adminOnly)
adminRoutes.lockMiddleware()

export const cloudRestrictedRoutes = customEndpointGroups.group(cloudRestricted)
cloudRestrictedRoutes.lockMiddleware()

export const loggedInRoutes = customEndpointGroups.group()
loggedInRoutes.lockMiddleware()
