import { Invite, UserRoles } from "@budibase/types"

export interface InviteUserAssignments {
  roles: UserRoles
  admin: { global: boolean }
  builder?: { global: boolean; creator?: boolean; apps?: string[] }
  userGroups?: string[]
}

/**
 * Translates the role/permission info stored against a pending invite into
 * the fields a User document needs
 */
export function deriveUserFieldsFromInvite(
  info: Invite["info"]
): InviteUserAssignments {
  const appRoles = info.apps || {}
  const creatorAppsFromRoles = Object.keys(appRoles).filter(
    appId => appRoles[appId] === "CREATOR"
  )

  const builderApps = [...(info.builder?.apps || []), ...creatorAppsFromRoles]
  const uniqueBuilderApps = [...new Set(builderApps)]
  const hasCreatorPerms =
    !!info.builder?.creator || creatorAppsFromRoles.length > 0

  const assignments: InviteUserAssignments = {
    roles: appRoles,
    admin: { global: info.admin?.global || false },
  }

  if (info.builder || hasCreatorPerms || uniqueBuilderApps.length) {
    assignments.builder = { global: info.builder?.global || false }
    if (hasCreatorPerms) {
      assignments.builder.creator = true
    }
    if (uniqueBuilderApps.length) {
      assignments.builder.apps = uniqueBuilderApps
    }
  }

  if (info.userGroups?.length) {
    assignments.userGroups = info.userGroups
  }

  return assignments
}
