import { auth, EndpointGroupList, middleware } from "@budibase/backend-core"
import cloudRestricted from "../../../middleware/cloudRestricted"

export const endpointGroupList = new EndpointGroupList()

export const publicRoutes = endpointGroupList.group({ public: true })
publicRoutes.lockMiddleware()

export const publicNoTenancyRoutes = endpointGroupList.group({
  public: true,
  noTenancy: true,
})
publicNoTenancyRoutes.lockMiddleware()

export const loggedInNoTenancyRoutes = endpointGroupList.group({
  noTenancy: true,
})
loggedInNoTenancyRoutes.lockMiddleware()

export const builderOrAdminRoutes = endpointGroupList.group(
  auth.workspaceBuilderOrAdmin
)
builderOrAdminRoutes.lockMiddleware()

export const builderRoutes = endpointGroupList.group(auth.builderOnly)
builderRoutes.lockMiddleware()

export const adminRoutes = endpointGroupList.group(auth.adminOnly)
adminRoutes.lockMiddleware()

export const cloudRestrictedRoutes = endpointGroupList.group(cloudRestricted)
cloudRestrictedRoutes.lockMiddleware()

export const cloudRestrictedNoTenancyRoutes = endpointGroupList.group(
  { noTenancy: true },
  cloudRestricted
)
cloudRestrictedNoTenancyRoutes.lockMiddleware()

export const publicCloudRestrictedNoTenancyRoutes = endpointGroupList.group(
  { public: true, noTenancy: true },
  cloudRestricted
)
publicCloudRestrictedNoTenancyRoutes.lockMiddleware()

export const internalRoutes = endpointGroupList.group(middleware.internalApi)
internalRoutes.lockMiddleware()

export const internalNoTenancyRoutes = endpointGroupList.group(
  { noTenancy: true },
  middleware.internalApi
)
internalNoTenancyRoutes.lockMiddleware()

export const loggedInRoutes = endpointGroupList.group()
loggedInRoutes.lockMiddleware()

export const adminNoTenancyRoutes = endpointGroupList.group(
  { noTenancy: true },
  auth.adminOnly
)
adminNoTenancyRoutes.lockMiddleware()
