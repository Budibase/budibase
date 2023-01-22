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
import { BBContext, ContextUser, User } from "@budibase/types"

export function updateAppRole(
  user: ContextUser,
  { appId }: { appId?: string } = {}
) {
  appId = appId || context.getAppId()

  if (!user || !user.roles) {
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
  if (appId) {
    user.roleId = user.roles[dbCore.getProdAppID(appId)]
  }
  // if a role wasn't found then either set as admin (builder) or public (everyone else)
  if (!user.roleId && user.builder && user.builder.global) {
    user.roleId = roles.BUILTIN_ROLE_IDS.ADMIN
  } else if (!user.roleId && !user?.userGroups?.length) {
    user.roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  } else if (user?.userGroups?.length) {
    user.roleId = undefined
  }

  delete user.roles
  return user
}

async function checkGroupRoles(
  user: ContextUser,
  { appId }: { appId?: string } = {}
) {
  if (user.roleId && user.roleId !== roles.BUILTIN_ROLE_IDS.PUBLIC) {
    return user
  }
  if (appId) {
    user.roleId = await groups.getGroupRoleId(user as User, appId)
  }
  return user
}

async function processUser(
  user: ContextUser,
  { appId }: { appId?: string } = {}
) {
  if (user) {
    delete user.password
  }
  user = await updateAppRole(user, { appId })
  if (!user.roleId && user?.userGroups?.length) {
    user = await checkGroupRoles(user, { appId })
  }

  return user
}

export async function getCachedSelf(ctx: BBContext, appId: string) {
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

export async function getGlobalUsers(users?: ContextUser[]) {
  const appId = context.getAppId()
  const db = tenancy.getGlobalDB()
  let globalUsers
  if (users) {
    const globalIds = users.map(user =>
      getGlobalIDFromUserMetadataID(user._id!)
    )
    globalUsers = (await db.allDocs(getMultiIDParams(globalIds))).rows.map(
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
  if (!appId) {
    return globalUsers
  }

  return globalUsers.map(user => updateAppRole(user))
}

export async function getGlobalUsersFromMetadata(users: ContextUser[]) {
  const globalUsers = await getGlobalUsers(users)
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
