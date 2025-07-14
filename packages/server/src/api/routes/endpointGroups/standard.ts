import authorized from "../../../middleware/authorized"
import { auth, permissions } from "@budibase/backend-core"
import { middleware } from "@budibase/pro"
import { EndpointGroup } from "../../utils"

export const builderGroup = new EndpointGroup()
builderGroup.addGroupMiddleware(authorized(permissions.BUILDER))

export const creatorGroup = new EndpointGroup()
creatorGroup.addGroupMiddleware(authorized(permissions.CREATOR))

export const builderAdminGroup = new EndpointGroup()
builderAdminGroup.addGroupMiddleware(auth.builderOrAdmin)

export const licensedGroup = new EndpointGroup()
licensedGroup.addGroupMiddleware(middleware.licenseAuth)

export const publicGroup = new EndpointGroup()
