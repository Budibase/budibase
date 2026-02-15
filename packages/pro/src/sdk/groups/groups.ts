import {
  cache,
  context,
  db as dbUtils,
  events,
  logging,
  roles,
  tenancy,
  users as usersCore,
  userUtils,
} from "@budibase/backend-core"
import {
  ContextUser,
  EnrichedUserGroup,
  User,
  UserGroup,
} from "@budibase/types"
import { GroupNameUnavailableError } from "../../api/errors"
import * as db from "../../db"
import * as features from "../features"
import * as quotas from "../quotas"

async function findHighestRole(groups: UserGroup[], appId: string) {
  try {
    const potentialRoles: string[] = []
    for (let group of groups) {
      if (group.roles) {
        const role = group.roles[dbUtils.getProdWorkspaceID(appId)]
        if (role) {
          potentialRoles.push(role)
        }
      }
    }
    const allRoleNumbersArr = await Promise.all(
      potentialRoles.map(async roleId => {
        return {
          [roleId]: await roles.roleToNumber(roleId),
        }
      })
    )
    let highestGroupRole
    let originalNum = undefined
    const roleNumbersMap: {
      [key: string]: { roleId: string; roleNum: number }
    } = {}
    allRoleNumbersArr.forEach(entry => {
      const [roleId, roleNum] = Object.entries(entry)[0]
      roleNumbersMap[roleId] = { roleId, roleNum }
    })
    for (let { roleId, roleNum } of Object.values(roleNumbersMap)) {
      if (originalNum === undefined || roleNum > originalNum) {
        originalNum = roleNum
        highestGroupRole = roleId
      }
    }
    return highestGroupRole
  } catch (error) {
    logging.logAlert(
      `Error finding higest role for ${groups.length} on app ${appId}`,
      error
    )
    throw error
  }
}

async function groupList(groupIds: string[], groups?: UserGroup[]) {
  if (groups) {
    groups = groups.filter(group => groupIds.includes(group._id!))
  } else {
    groups = await db.groups.getBulk(groupIds, {
      enriched: false,
    })
  }
  return groups
}

export async function getGroupBuilderAppIds(
  user: User | ContextUser,
  opts?: { appId?: string; groups?: UserGroup[] }
) {
  if (!user.userGroups) {
    return []
  }
  const groups = await groupList(user.userGroups, opts?.groups)
  const prodAppId = opts?.appId ? dbUtils.getProdWorkspaceID(opts?.appId) : null
  let appIds: string[] = []
  for (let group of groups) {
    const groupApps = group.builder?.apps
    if (prodAppId && groupApps?.includes(prodAppId)) {
      appIds.push(prodAppId)
    } else if (!prodAppId) {
      appIds = appIds.concat(groupApps || [])
    }
  }
  return [...new Set(appIds)]
}

export async function getGroupRoleId(
  user: User | ContextUser,
  workspaceId: string,
  opts?: { groups?: UserGroup[] }
) {
  // If the user is part of a group or groups, then we want to find the highest roleId for that user
  // within the group, and overwrite the user defined role, therefore providing group based access
  // on a user / app level
  if (!user.userGroups) {
    return null
  }

  let groups: UserGroup[] = await groupList(user.userGroups, opts?.groups)

  // if the user has a role for the app already, the group doesn't override it
  const prodAppId = dbUtils.getProdWorkspaceID(workspaceId)
  if (user.roles?.[prodAppId]) {
    return user.roles[prodAppId]
  }

  // reduce the groups down to where the apps exist
  groups = groups.filter((group: UserGroup) => {
    if (!group?.roles) {
      return false
    }
    const appIds = Object.keys(group.roles)
    return appIds.includes(prodAppId)
  })

  // Check if we're already in the correct workspace context
  // This is important during migrations to avoid nested context switches
  const currentContext = context.getCurrentContext()
  const currentAppId = currentContext?.appId
  if (currentAppId === workspaceId) {
    return findHighestRole(groups, workspaceId)
  } else {
    return await context.doInWorkspaceContext(workspaceId, async () => {
      return findHighestRole(groups, workspaceId)
    })
  }
}

export async function enrichUserRolesFromGroups(user: User) {
  if (!user || !user.userGroups) {
    return user
  }
  const groups = await getBulk(user.userGroups, { enriched: false })
  let allGroupAppIds: string[] = []
  for (let group of groups) {
    if (group?.roles) {
      allGroupAppIds = allGroupAppIds.concat(Object.keys(group.roles))
    }
  }
  // get the unique app IDs
  allGroupAppIds = [...new Set(allGroupAppIds)]
  for (let appId of allGroupAppIds) {
    await context.doInWorkspaceContext(appId, async () => {
      if (user.roles[appId]) {
        return
      }
      const role = await findHighestRole(groups, appId)
      if (role) {
        user.roles[appId] = role
      }
    })
  }
  const builderAppIds = await getGroupBuilderAppIds(user, { groups })
  if (builderAppIds.length && !user.builder?.global) {
    const existing = user.builder?.apps || []
    user.builder = {
      ...user.builder,
      apps: existing.concat(builderAppIds),
    }
  }
  return user
}

export async function fetch() {
  return await db.groups.fetch()
}

export async function get(id: string) {
  return (await db.groups.get(id)) as UserGroup
}

export async function getBulk(
  ids: string[],
  opts: { enriched: true }
): Promise<EnrichedUserGroup[]>
export async function getBulk(
  ids: string[],
  opts: { enriched: false }
): Promise<UserGroup[]>
export async function getBulk(
  ids: string[],
  opts?: { enriched?: boolean }
): Promise<UserGroup[]>
export async function getBulk(
  ids: string[],
  opts: { enriched?: boolean } = { enriched: true }
): Promise<UserGroup[] | EnrichedUserGroup[]> {
  return db.groups.getBulk(ids, opts as { enriched: true })
}

async function guardNameAvailability(name: string) {
  const existingGroup = await db.groups.getByName(name)
  if (existingGroup) {
    throw new GroupNameUnavailableError(name)
  }
}

async function getCreatorsCountInGroup(group: UserGroup) {
  let usersInGroup = await db.groups.getGroupUsers(group._id!)
  if (!usersInGroup.length) {
    return 0
  }

  const globalDb = tenancy.getGlobalDB()

  const users = await globalDb.getMultiple<User>(usersInGroup.map(u => u._id))
  const creatorsInGroup = await userUtils.creatorsInList(users)

  return creatorsInGroup.filter(x => x).length
}

export async function save(group: UserGroup | EnrichedUserGroup) {
  let eventPromises = []
  // Config does not exist yet
  let isCreate = !group._id
  // Number of creators derived of group role promotion
  let newCreators = 0

  if (!group._id) {
    group._id = db.groups.generateUserGroupID()
    await guardNameAvailability(group.name)
    eventPromises.push(events.group.created(group))
  } else {
    const oldGroup = await db.groups.get(group._id)
    if (oldGroup.name !== group.name) {
      await guardNameAvailability(group.name)
    }
    eventPromises.push(events.group.updated(group))
    if (JSON.stringify(oldGroup.roles) !== JSON.stringify(group.roles)) {
      const usersCountInGroup = oldGroup.users?.length || 0
      let creatorsCountBeforeSave = 0
      if (usersCountInGroup > 0) {
        creatorsCountBeforeSave = await getCreatorsCountInGroup(oldGroup)
      }
      if (Object.values(group.roles as object).includes("CREATOR")) {
        newCreators = usersCountInGroup - creatorsCountBeforeSave
      } else {
        newCreators = -usersCountInGroup
      }
      eventPromises.push(events.group.permissionsEdited(group))
    }
  }

  await Promise.all(eventPromises)
  const { users: _users, ...groupToSave } = group
  const saveGroup = () => {
    return db.groups.save(groupToSave)
  }
  if (isCreate) {
    return await quotas.addGroup(saveGroup)
  } else {
    const savedGroup = await saveGroup()
    if (newCreators > 0) {
      await quotas.addUsers(0, newCreators)
    } else if (newCreators < 0) {
      const creatorsCountAfterSave = await getCreatorsCountInGroup(group)
      const creatorsToRemove = Math.abs(newCreators) - creatorsCountAfterSave
      if (creatorsToRemove > 0) {
        await quotas.removeUsers(0, creatorsToRemove)
      }
    }
    return savedGroup
  }
}

export async function remove(groupId: string, revision: string) {
  let group
  try {
    group = await db.groups.get(groupId)
  } catch (err) {
    throw new Error("Group not found")
  }

  const isCreatorGroup = Object.values((group.roles || {}) as object).includes(
    "CREATOR"
  )
  let recalculateCreatorsQuotasFn: () => Promise<void> | void = () => {}
  if (isCreatorGroup) {
    const globalDb = tenancy.getGlobalDB()
    const usersInGroup = await db.groups.getGroupUsers(groupId)
    const users = await Promise.all(
      (usersInGroup as User[]).map(user => {
        return globalDb.get<User>(user._id)
      })
    )
    const usersWithoutGroup = users.map(user => ({
      ...user,
      userGroups: user.userGroups!.filter(grp => grp !== groupId),
    }))
    const creatorsEval = await userUtils.creatorsInList(usersWithoutGroup)
    const creatorsCount = creatorsEval.filter(x => x).length
    const creatorsToRemove = usersInGroup.length - creatorsCount
    if (creatorsToRemove) {
      recalculateCreatorsQuotasFn = () =>
        quotas.removeUsers(0, creatorsToRemove)
    }
  }

  let resp = await db.groups.destroy(groupId, revision)
  await events.group.deleted(group)
  await quotas.removeGroup()
  await recalculateCreatorsQuotasFn()
  return resp as any
}

export async function addUsers(groupId: string, userIds: string[]) {
  const group = await db.groups.get(groupId)
  const users = await usersCore.bulkGetGlobalUsersById(userIds)
  let toUpdate: User[] = []
  for (let user of users) {
    if (!user.userGroups) {
      user.userGroups = []
    }
    if (!user.userGroups.includes(groupId)) {
      toUpdate.push(user)
    }
  }

  if (!toUpdate.length) {
    return toUpdate
  }

  const updatedUsers = toUpdate.map(user => ({
    ...user,
    userGroups: [...(user?.userGroups || []), groupId],
  }))
  await usersCore.bulkUpdateGlobalUsers(updatedUsers)

  const isCreatorGroup = Object.values((group.roles || {}) as object).includes(
    "CREATOR"
  )
  if (isCreatorGroup) {
    const creatorsEval = await userUtils.creatorsInList(toUpdate)
    const creatorsCount = creatorsEval.filter(x => x).length
    const creatorsToAdd = toUpdate.length - creatorsCount
    if (creatorsToAdd) {
      await quotas.addUsers(0, creatorsToAdd)
    }
  }

  let promises = []
  for (let userId of userIds) {
    promises.push(cache.user.invalidateUser(userId))
  }
  await Promise.all(promises)

  await events.group.usersAdded(updatedUsers.length, group, userIds)

  return updatedUsers
}

export async function removeUsers(groupId: string, userIds: string[]) {
  const group = await db.groups.get(groupId)
  const users = await usersCore.bulkGetGlobalUsersById(userIds)
  let toUpdate: User[] = []
  for (let user of users) {
    if (!user.userGroups || !user.userGroups.includes(groupId)) {
      continue
    }
    const idx = user.userGroups.indexOf(groupId)
    user.userGroups.splice(idx, 1)
    toUpdate.push(user)
  }
  await usersCore.bulkUpdateGlobalUsers(toUpdate)

  const isCreatorGroup = Object.values((group.roles || {}) as object).includes(
    "CREATOR"
  )
  if (isCreatorGroup) {
    const creatorsEval = await userUtils.creatorsInList(toUpdate)
    const creatorsCount = creatorsEval.filter(x => x).length
    const creatorsToRemove = toUpdate.length - creatorsCount
    if (creatorsToRemove) {
      await quotas.removeUsers(0, creatorsToRemove)
    }
  }

  let promises = []
  for (let userId of userIds) {
    promises.push(cache.user.invalidateUser(userId))
  }
  await Promise.all(promises)

  if (toUpdate.length) {
    await events.group.usersDeleted(toUpdate.length, group, userIds)
  }
  return toUpdate
}

export async function updateGroupApps(
  groupId: string,
  opts: {
    appsToRemove?: { appId: string }[]
    appsToAdd?: { appId: string; roleId: string }[]
  }
) {
  const group = await get(groupId)
  if (!group.roles) {
    group.roles = {}
  }
  if (opts.appsToAdd) {
    for (let add of opts.appsToAdd) {
      group.roles[add.appId] = add.roleId
    }
  }
  if (opts.appsToRemove) {
    for (let remove of opts.appsToRemove) {
      delete group.roles[remove.appId]
    }
  }

  group.builder = {
    apps: Object.entries(group.roles)
      .filter(([_groupId, role]) => role === "CREATOR")
      .map(([groupId]) => groupId),
  }

  return await save(group)
}

export async function cleanupApp(appId: string) {
  const groupList = await fetch()
  const toUpdate = []
  for (let group of groupList) {
    if (!group.roles || !group.roles[appId]) {
      continue
    }
    delete group.roles[appId]
    toUpdate.push(group)
  }
  return await db.groups.bulkSave(toUpdate)
}

export async function adjustGroupCreatorsQuotas() {
  if (!(await features.isUserGroupsEnabled())) {
    const globalDb = tenancy.getGlobalDB()

    const groups = (await fetch()) || []
    const creatorGroups = groups.filter(group =>
      Object.values(group?.roles || {}).includes("CREATOR")
    )

    for (let group of creatorGroups) {
      const usersInGroup = await db.groups.getGroupUsers(group._id!)
      const users = await Promise.all(
        (usersInGroup as User[]).map(user => {
          return globalDb.get<User>(user._id)
        })
      )
      const usersWithoutGroup = users.map(user => ({
        ...user,
        userGroups: user.userGroups!.filter(grp => grp !== group._id!),
      }))
      const creatorsEval = await userUtils.creatorsInList(usersWithoutGroup)
      const creatorsCount = creatorsEval.filter(x => x).length
      const creatorsToRemove = usersInGroup.length - creatorsCount

      await db.groups.save({ ...group, roles: {} })
      if (creatorsToRemove) {
        await quotas.removeUsers(0, creatorsToRemove)
      }
    }
  }
}
