import { users } from "@/stores/portal/users"
import type { UserInfo } from "@/types"
import { Constants } from "@budibase/frontend-core"
import type { User } from "@budibase/types"
import { getRoleFlags, shouldSyncGlobalRole } from "./roleUtils"

export interface UserData {
  users: UserInfo[]
  groups: string[]
  assignToWorkspace?: boolean
}

export interface WorkspaceExistingUserResult {
  usersToInvite: UserInfo[]
  addedToWorkspaceEmails: string[]
  assignedCount: number
  failedCount: number
}

export const getWorkspaceRole = (
  workspaceId: string,
  role?: string,
  appRole?: string
) => {
  if (!workspaceId || !role) {
    return undefined
  }
  if (role === Constants.BudibaseRoles.Creator) {
    return Constants.Roles.CREATOR
  }
  if (role === Constants.BudibaseRoles.Admin) {
    return Constants.Roles.ADMIN
  }
  if (role === Constants.BudibaseRoles.AppUser) {
    return appRole || Constants.Roles.BASIC
  }
  return Constants.Roles.BASIC
}

export const assignExistingUsersToWorkspace = async (
  userData: UserData,
  workspaceId: string
): Promise<WorkspaceExistingUserResult> => {
  if (!workspaceId) {
    return {
      usersToInvite: userData.users,
      addedToWorkspaceEmails: [],
      assignedCount: 0,
      failedCount: 0,
    }
  }

  const existingUsers = (await users.fetch()) || []
  const existingByEmail = new Map(
    existingUsers.map(user => [user.email.toLowerCase(), user])
  )
  const usersToInvite: UserInfo[] = []
  const usersToAssign: {
    user: User
    role: string
    selectedRole: string
    email: string
  }[] = []

  for (const user of userData.users) {
    const existingUser = existingByEmail.get(user.email.toLowerCase())
    if (!existingUser) {
      usersToInvite.push(user)
      continue
    }
    const role = getWorkspaceRole(workspaceId, user.role, user.appRole)
    if (role && existingUser._id) {
      usersToAssign.push({
        user: existingUser,
        role,
        selectedRole: user.role,
        email: user.email,
      })
    }
  }

  const assignmentResults = await Promise.allSettled(
    usersToAssign.map(async ({ user, role, selectedRole, email }) => {
      let rev = user._rev
      let fullUser = user
      if (user._id && (!rev || shouldSyncGlobalRole(selectedRole, user))) {
        const loaded = await users.get(user._id)
        if (loaded) {
          fullUser = loaded
          rev = loaded._rev
        }
      }
      if (user._id && fullUser && shouldSyncGlobalRole(selectedRole, fullUser)) {
        const roleUpdates = getRoleFlags(selectedRole, fullUser)
        const saved = await users.save({ ...fullUser, ...roleUpdates })
        rev = saved?._rev || rev
      }
      if (!user._id || !rev) {
        throw new Error("User ID or revision missing")
      }
      await users.addUserToWorkspace(user._id, role, rev)
      return email
    })
  )

  const addedToWorkspaceEmails = assignmentResults
    .filter(
      (result): result is PromiseFulfilledResult<string> =>
        result.status === "fulfilled"
    )
    .map(result => result.value)

  return {
    usersToInvite,
    addedToWorkspaceEmails,
    assignedCount: addedToWorkspaceEmails.length,
    failedCount: assignmentResults.filter(result => result.status === "rejected")
      .length,
  }
}
