import { Constants } from "@budibase/frontend-core"
import { sdk } from "@budibase/shared-core"
import type { User } from "@budibase/types"

export const getRoleFlags = (role: string, currentUser?: User) => {
  if (role === Constants.BudibaseRoles.Developer) {
    return { admin: { global: false }, builder: { global: true } }
  }
  if (
    [Constants.BudibaseRoles.Admin, Constants.BudibaseRoles.Owner].includes(
      role
    )
  ) {
    return { admin: { global: true }, builder: { global: true } }
  }
  if (role === Constants.BudibaseRoles.Creator) {
    return {
      admin: { global: false },
      builder: {
        global: false,
        creator: true,
        apps: currentUser?.builder?.apps || [],
      },
    }
  }
  return {
    admin: { global: false },
    builder: { global: false, creator: false, apps: [] },
  }
}

export const shouldSyncGlobalRole = (role: string, user?: User) => {
  if (role !== Constants.BudibaseRoles.Admin) {
    return false
  }
  return !sdk.users.isAdmin(user)
}
