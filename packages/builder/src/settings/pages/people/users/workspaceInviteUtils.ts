import { users } from "@/stores/portal/users"
import { groups as groupStore } from "@/stores/portal/groups"
import type { UserInfo } from "@/types"
import { Constants } from "@budibase/frontend-core"
import type { User, UserGroup } from "@budibase/types"
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

export interface WorkspaceCreatedUserResult {
  addedToWorkspaceEmails: string[]
  assignedCount: number
  failedCount: number
}

export interface WorkspaceCreatedUser {
  _id: string
  email: string
}

export interface InvitePayloadUser {
  email: string
  builder: boolean
  creator: boolean
  admin: boolean
  groups: string[]
  apps?: Record<string, string>
}

export const dedupeUsersByEmail = (userData: UserData): UserData => {
  const usersByEmail = new Map<string, UserInfo>()
  for (const user of userData.users || []) {
    const email = user.email.toLowerCase()
    if (!usersByEmail.has(email)) {
      usersByEmail.set(email, user)
    }
  }
  return { ...userData, users: Array.from(usersByEmail.values()) }
}

export const buildWorkspaceInvitePayload = (
  usersForInvite: UserInfo[],
  groups: string[],
  workspaceId: string,
  assignToWorkspace = true,
  allGroups: UserGroup[] = []
): InvitePayloadUser[] => {
  return usersForInvite.map(user => {
    const workspaceRole = shouldUseGroupWorkspaceRole({
      workspaceId,
      role: user.role,
      appRole: user.appRole,
      selectedGroupIds: groups,
      allGroups,
    })
      ? undefined
      : getWorkspaceRole(workspaceId, user.role, user.appRole)
    return {
      email: user.email,
      builder: user.role === Constants.BudibaseRoles.Developer,
      creator: user.role === Constants.BudibaseRoles.Creator,
      admin: user.role === Constants.BudibaseRoles.Admin,
      groups,
      apps:
        assignToWorkspace && workspaceId && workspaceRole
          ? { [workspaceId]: workspaceRole }
          : undefined,
    }
  })
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

interface ShouldUseGroupWorkspaceRoleParams {
  workspaceId: string
  role?: string
  appRole?: string
  selectedGroupIds?: string[]
  allGroups?: UserGroup[]
  useDefaultGroupFallback?: boolean
}

export const getEffectiveGroupIds = (
  selectedGroupIds: string[],
  allGroups: UserGroup[],
  useDefaultGroupFallback = true
) => {
  if (selectedGroupIds.length) {
    return selectedGroupIds
  }
  if (!useDefaultGroupFallback) {
    return []
  }
  const defaultGroupId = allGroups.find(group => group.isDefault)?._id
  return defaultGroupId ? [defaultGroupId] : []
}

export const shouldUseGroupWorkspaceRole = ({
  workspaceId,
  role,
  appRole,
  selectedGroupIds = [],
  allGroups = [],
  useDefaultGroupFallback = true,
}: ShouldUseGroupWorkspaceRoleParams) => {
  if (role !== Constants.BudibaseRoles.AppUser) {
    return false
  }

  if (!workspaceId) {
    return false
  }

  if (appRole && appRole !== Constants.Roles.BASIC) {
    return false
  }

  const effectiveGroupIds = getEffectiveGroupIds(
    selectedGroupIds,
    allGroups,
    useDefaultGroupFallback
  )
  if (!effectiveGroupIds.length) {
    return false
  }

  return effectiveGroupIds.some(groupId => {
    return !!allGroups.find(group => {
      return group._id === groupId && group.roles?.[workspaceId]
    })
  })
}

export const assignExistingUsersToWorkspace = async (
  userData: UserData,
  workspaceId: string,
  allGroups: UserGroup[] = []
): Promise<WorkspaceExistingUserResult> => {
  const dedupedUserData = dedupeUsersByEmail(userData)
  if (!workspaceId) {
    return {
      usersToInvite: dedupedUserData.users,
      addedToWorkspaceEmails: [],
      assignedCount: 0,
      failedCount: 0,
    }
  }

  const existingUsers = (await users.fetch()) || []
  const existingByEmail = new Map(
    existingUsers.map(user => [user.email.toLowerCase(), user])
  )
  const effectiveGroupIds = getEffectiveGroupIds(
    dedupedUserData.groups,
    allGroups
  )
  const usersToInvite: UserInfo[] = []
  const groupManagedUsers: string[] = []
  const usersToAssign: {
    user: User
    role?: string
    selectedRole: string
    email: string
    groupIdsToAdd: string[]
  }[] = []

  for (const user of dedupedUserData.users) {
    const existingUser = existingByEmail.get(user.email.toLowerCase())
    if (!existingUser) {
      usersToInvite.push(user)
      continue
    }
    const currentGroupIds = existingUser.userGroups || []
    const groupIdsToAdd = effectiveGroupIds.filter(groupId => {
      return !currentGroupIds.includes(groupId)
    })
    const resultingGroupIds = [
      ...new Set([...currentGroupIds, ...effectiveGroupIds]),
    ]
    const useGroupWorkspaceRole = shouldUseGroupWorkspaceRole({
      workspaceId,
      role: user.role,
      appRole: user.appRole,
      selectedGroupIds: resultingGroupIds,
      allGroups,
      useDefaultGroupFallback: false,
    })
    const role = useGroupWorkspaceRole
      ? undefined
      : getWorkspaceRole(workspaceId, user.role, user.appRole)

    if (!role && !groupIdsToAdd.length) {
      groupManagedUsers.push(user.email)
      continue
    }
    if (existingUser._id) {
      usersToAssign.push({
        user: existingUser,
        role,
        selectedRole: user.role,
        email: user.email,
        groupIdsToAdd,
      })
    }
  }

  const assignmentResults = await Promise.allSettled(
    usersToAssign.map(
      async ({ user, role, selectedRole, email, groupIdsToAdd }) => {
        let rev = user._rev
        let fullUser = user
        if (
          user._id &&
          (groupIdsToAdd.length ||
            !rev ||
            shouldSyncGlobalRole(selectedRole, user))
        ) {
          const loaded = await users.get(user._id)
          if (loaded) {
            fullUser = loaded
            rev = loaded._rev
          }
        }
        if (
          user._id &&
          fullUser &&
          shouldSyncGlobalRole(selectedRole, fullUser)
        ) {
          const roleUpdates = getRoleFlags(selectedRole, fullUser)
          const saved = await users.save({ ...fullUser, ...roleUpdates })
          rev = saved?._rev || rev
        }
        if (!user._id) {
          throw new Error("User ID missing")
        }
        if (groupIdsToAdd.length) {
          await Promise.all(
            groupIdsToAdd.map(groupId => groupStore.addUser(groupId, user._id!))
          )
        }
        if (!role) {
          return email
        }
        if (groupIdsToAdd.length || !rev) {
          const loaded = await users.get(user._id)
          rev = loaded?._rev
        }
        if (!user._id || !rev) {
          throw new Error("User ID or revision missing")
        }
        await users.addUserToWorkspace(user._id, role, rev)
        return email
      }
    )
  )

  const assignedUsers = assignmentResults
    .filter(
      (result): result is PromiseFulfilledResult<string> =>
        result.status === "fulfilled"
    )
    .map(result => result.value)
  const addedToWorkspaceEmails = [...groupManagedUsers, ...assignedUsers]

  return {
    usersToInvite,
    addedToWorkspaceEmails,
    assignedCount: addedToWorkspaceEmails.length,
    failedCount: assignmentResults.filter(
      result => result.status === "rejected"
    ).length,
  }
}

export const assignCreatedUsersToWorkspace = async (
  createdUsers: WorkspaceCreatedUser[],
  sourceUsers: UserInfo[],
  workspaceId: string,
  selectedGroupIds: string[] = [],
  allGroups: UserGroup[] = []
): Promise<WorkspaceCreatedUserResult> => {
  if (!workspaceId || !createdUsers.length) {
    return {
      addedToWorkspaceEmails: [],
      assignedCount: 0,
      failedCount: 0,
    }
  }

  const sourceUsersByEmail = new Map(
    dedupeUsersByEmail({ users: sourceUsers, groups: [] }).users.map(user => [
      user.email.toLowerCase(),
      user,
    ])
  )
  const assignmentResults = await Promise.allSettled(
    createdUsers.map(async createdUser => {
      const matchingUser = sourceUsersByEmail.get(
        createdUser.email.toLowerCase()
      )
      const role = getWorkspaceRole(
        workspaceId,
        matchingUser?.role,
        matchingUser?.appRole
      )
      const useGroupWorkspaceRole = shouldUseGroupWorkspaceRole({
        workspaceId,
        role: matchingUser?.role,
        appRole: matchingUser?.appRole,
        selectedGroupIds,
        allGroups,
      })
      if (useGroupWorkspaceRole) {
        return null
      }
      if (!role) {
        return null
      }
      const fullUser = await users.get(createdUser._id)
      if (!fullUser?._rev) {
        throw new Error("User revision missing")
      }
      await users.addUserToWorkspace(createdUser._id, role, fullUser._rev)
      return createdUser.email
    })
  )

  const addedToWorkspaceEmails = assignmentResults
    .filter(
      (result): result is PromiseFulfilledResult<string | null> =>
        result.status === "fulfilled"
    )
    .map(result => result.value)
    .filter((email): email is string => !!email)

  return {
    addedToWorkspaceEmails,
    assignedCount: addedToWorkspaceEmails.length,
    failedCount: assignmentResults.filter(
      result => result.status === "rejected"
    ).length,
  }
}
