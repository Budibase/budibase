import authorized from "../../../middleware/authorized"
import { auth, permissions } from "@budibase/backend-core"
import { customEndpointGroups } from "./custom"
import { middleware } from "@budibase/pro"

export const globalBuilderGroup = customEndpointGroups.group()
globalBuilderGroup.addGroupMiddleware(authorized(permissions.GLOBAL_BUILDER))
globalBuilderGroup.lockMiddleware()

export const builderGroup = customEndpointGroups.group()
builderGroup.addGroupMiddleware(authorized(permissions.BUILDER))
builderGroup.lockMiddleware()

export const creatorGroup = customEndpointGroups.group()
creatorGroup.addGroupMiddleware(authorized(permissions.CREATOR))
creatorGroup.lockMiddleware()

export const builderAdminGroup = customEndpointGroups.group()
builderAdminGroup.addGroupMiddleware(auth.builderOrAdmin)
builderAdminGroup.lockMiddleware()

export const licensedGroup = customEndpointGroups.group()
licensedGroup.addGroupMiddleware(middleware.licenseAuth)
licensedGroup.lockMiddleware()

export const publicGroup = customEndpointGroups.group()
publicGroup.lockMiddleware()
