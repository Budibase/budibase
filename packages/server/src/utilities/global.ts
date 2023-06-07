import { getMultiIDParams, getGlobalIDFromUserMetadataID } from "../db/utils"
import {
  roles,
  db as dbCore,
  cache,
  tenancy,
  context,
} from "@budibase/backend-core"
import env from "../environment"
import { groups } from "@budibase/pro"
import { UserCtx, ContextUser, User, UserGroup } from "@budibase/types"
import { global } from "yargs"

export function updateAppRole(
  user: ContextUser,
  { appId }: { appId?: string } = {}
) {
  appId = appId || context.getAppId()

  if (!user || (!user.roles && !user.userGroups)) {
    return user
  }
  // if in an multi-tenancy environment make sure roles are never updated
  if (env.MULTI_TENANCY && appId && !tenancy.isUserInAppTenant(appId, user)) {
    delete user.builder
    delete user.admin
    user.roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
    return user
  }
  // always use the deployed app
  if (appId && user.roles) {
    user.roleId = user.roles[dbCore.getProdAppID(appId)]
  }
  // if a role wasn't found then either set as admin (builder) or public (everyone else)
  if (!user.roleId && user.builder && user.builder.global) {
    user.roleId = roles.BUILTIN_ROLE_IDS.ADMIN
  } else if (!user.roleId && !user?.userGroups?.length) {
    user.roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  }

  delete user.roles
  return user
}

async function checkGroupRoles(
  user: ContextUser,
  opts: { appId?: string; groups?: UserGroup[] } = {}
) {
  if (user.roleId && user.roleId !== roles.BUILTIN_ROLE_IDS.PUBLIC) {
    return user
  }
  if (opts.appId) {
    user.roleId = await groups.getGroupRoleId(user as User, opts.appId, {
      groups: opts.groups,
    })
  }
  // final fallback, simply couldn't find a role - user must be public
  if (!user.roleId) {
    user.roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  }
  return user
}

export async function processUser(
  user: ContextUser,
  opts: { appId?: string; groups?: UserGroup[] } = {}
) {
  if (user) {
    delete user.password
  }
  const appId = opts.appId || context.getAppId()
  user = updateAppRole(user, { appId })
  if (!user.roleId && user?.userGroups?.length) {
    user = await checkGroupRoles(user, { appId, groups: opts?.groups })
  }

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
  return db.get(getGlobalIDFromUserMetadataID(userId))
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
