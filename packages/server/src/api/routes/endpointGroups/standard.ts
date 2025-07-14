import authorized from "../../../middleware/authorized"
import { auth, permissions } from "@budibase/backend-core"
import { customEndpointGroups } from "./custom"
import { middleware } from "@budibase/pro"

export const builderGroup = customEndpointGroups.group()
builderGroup.addGroupMiddleware(authorized(permissions.BUILDER))

export const creatorGroup = customEndpointGroups.group()
creatorGroup.addGroupMiddleware(authorized(permissions.CREATOR))

export const builderAdminGroup = customEndpointGroups.group()
builderAdminGroup.addGroupMiddleware(auth.builderOrAdmin)

export const licensedGroup = customEndpointGroups.group()
licensedGroup.addGroupMiddleware(middleware.licenseAuth)

export const publicGroup = customEndpointGroups.group()
