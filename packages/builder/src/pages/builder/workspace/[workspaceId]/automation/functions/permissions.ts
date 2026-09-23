import { sdk } from "@budibase/shared-core"
import type { UserAdminInfo, UserBuilderInfo } from "@budibase/types"

export const canManageFunctions = (
  user: (UserBuilderInfo & UserAdminInfo) | undefined,
  workspaceId: string | undefined
) => !!workspaceId && !!user && sdk.users.isAdminOrBuilder(user, workspaceId)
