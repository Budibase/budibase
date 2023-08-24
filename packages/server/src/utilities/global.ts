import { getMultiIDParams, getGlobalIDFromUserMetadataID } from "../db/utils"
import {
  roles,
  db as dbCore,
  cache,
  tenancy,
  context,
  users,
} from "@budibase/backend-core"
import env from "../environment"
import { groups } from "@budibase/pro"
import { UserCtx, ContextUser, User, UserGroup } from "@budibase/types"
import cloneDeep from "lodash/cloneDeep"

export async function processUser(
  user: ContextUser,
  opts: { appId?: string; groups?: UserGroup[] } = {}
) {
  if (!user || (!user.roles && !user.userGroups)) {
    return user
  }
  user = cloneDeep(user)
  delete user.password
  const appId = opts.appId || context.getAppId()
  if (!appId) {
    throw new Error("Unable to process user without app ID")
  }
  // if in a multi-tenancy environment and in wrong tenant make sure roles are never updated
  if (env.MULTI_TENANCY && appId && !tenancy.isUserInAppTenant(appId, user)) {
    user = users.removePortalUserPermissions(user)
    user.roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
    return user
  }
  let groupList: UserGroup[] = []
  if (appId && user?.userGroups?.length) {
    groupList = opts.groups
      ? opts.groups
      : await groups.getBulk(user.userGroups)
  }
  // check if a group provides builder access
  const builderAppIds = await groups.getGroupBuilderAppIds(user, {
    appId,
    groups: groupList,
  })
  if (builderAppIds.length && !users.isBuilder(user, appId)) {
    const existingApps = user.builder?.apps || []
    user.builder = {
      apps: [...new Set(existingApps.concat(builderAppIds))],
    }
  }
  // builders are always admins within the app
  if (users.isBuilder(user, appId)) {
    user.roleId = roles.BUILTIN_ROLE_IDS.ADMIN
  }
  // try to get the role from the user list
  if (!user.roleId && appId && user.roles) {
    user.roleId = user.roles[dbCore.getProdAppID(appId)]
  }
  // try to get the role from the group list
  if (!user.roleId && groupList) {
    user.roleId = await groups.getGroupRoleId(user, appId, {
      groups: groupList,
    })
  }
  // final fallback, simply couldn't find a role - user must be public
  if (!user.roleId) {
    user.roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  }
  // remove the roles as it is now set
  delete user.roles
  return user
}

export async function getCachedSelf(ctx: UserCtx, appId: string) {
  // this has to be tenant aware, can't depend on the context to find it out
  // running some middlewares before the tenancy causes context to break
  const user = await cache.user.getUser(ctx.user?._id!)
  return processUser(user, { appId })
}

export async function getRawGlobalUser(userId: string) {
  const db = tenancy.getGlobalDB()
  return db.get<User>(getGlobalIDFromUserMetadataID(userId))
}

export async function getGlobalUser(userId: string) {
  const appId = context.getAppId()
  let user = await getRawGlobalUser(userId)
  return processUser(user, { appId })
}

export async function getGlobalUsers(
  userIds?: string[],
  opts?: { noProcessing?: boolean }
) {
  const appId = context.getAppId()
  const db = tenancy.getGlobalDB()
  let globalUsers
  if (userIds) {
    globalUsers = (await db.allDocs(getMultiIDParams(userIds))).rows.map(
      row => row.doc
    )
  } else {
    globalUsers = (
      await db.allDocs(
        dbCore.getGlobalUserParams(null, {
          include_docs: true,
        })
      )
    ).rows.map(row => row.doc)
  }
  globalUsers = globalUsers
    .filter(user => user != null)
    .map(user => {
      delete user.password
      delete user.forceResetPassword
      return user
    })

  if (opts?.noProcessing || !appId) {
    return globalUsers
  } else {
    // pass in the groups, meaning we don't actually need to retrieve them for
    // each user individually
    const allGroups = await groups.fetch()
    return Promise.all(
      globalUsers.map(user => processUser(user, { groups: allGroups }))
    )
  }
}

export async function getGlobalUsersFromMetadata(users: ContextUser[]) {
  const globalUsers = await getGlobalUsers(users.map(user => user._id!))
  return users.map(user => {
    const globalUser = globalUsers.find(
      globalUser => globalUser && user._id?.includes(globalUser._id)
    )
    return {
      ...globalUser,
      // doing user second overwrites the id and rev (always metadata)
      ...user,
    }
  })
}
