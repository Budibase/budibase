import {
  allGlobalUsers,
  deleteGlobalUser,
  readGlobalUser,
  saveGlobalUser,
} from "../../../utilities/workerRequests"
import { publicApiUserFix } from "../../../utilities/users"
import { db as dbCore, users } from "@budibase/backend-core"
import { search as stringSearch } from "./utils"
import type { UserCtx, User } from "@budibase/types"
import { Feature } from "@budibase/types"
import type { Next } from "koa"
import { sdk } from "@budibase/pro"
import { isEqual, cloneDeep } from "lodash"
import {
  validateBuilderAppUpdate,
  validateGlobalRoleUpdate,
  validateRolesUpdate,
} from "./globalRoleValidation"

function rolesRemoved(base: User, ctx: UserCtx) {
  return (
    !isEqual(base.builder, ctx.request.body.builder) ||
    !isEqual(base.admin, ctx.request.body.admin) ||
    !isEqual(base.roles, ctx.request.body.roles)
  )
}

const NO_ROLES_MSG =
  "Roles/admin/builder can only be set on business/enterprise licenses - input ignored."

async function createUpdateResponse(ctx: UserCtx, user?: User) {
  let groupsToAdd: string[] = []
  let groupsToRemove: string[] = []

  if (ctx.request.body.userGroups !== undefined) {
    const requestedGroups: string[] = ctx.request.body.userGroups || []
    const currentGroups: string[] = user?.userGroups || []
    const unchanged =
      user && isEqual([...requestedGroups].sort(), [...currentGroups].sort())
    if (unchanged) {
      delete ctx.request.body.userGroups
    } else {
      if (!users.isAdmin(ctx.user)) {
        ctx.throw(403, "Only global admins can update user group memberships.")
      }
      await sdk.features.checkFeatures([
        Feature.EXPANDED_PUBLIC_API,
        Feature.USER_GROUPS,
      ])

      if (user) {
        groupsToAdd = requestedGroups.filter(id => !currentGroups.includes(id))
        groupsToRemove = currentGroups.filter(
          id => !requestedGroups.includes(id)
        )
        const changedIds = [...new Set([...groupsToAdd, ...groupsToRemove])]

        if (changedIds.length > 0) {
          const changedGroups = await sdk.groups.getBulk(changedIds, {
            enriched: false,
          })
          const added = changedGroups.filter(g => groupsToAdd.includes(g._id!))
          if (
            changedGroups.length !== changedIds.length ||
            added.length !== groupsToAdd.length ||
            changedGroups.some(g => g.scimInfo?.isSync)
          ) {
            ctx.throw(404, "Group not found or managed by SCIM")
          }
        }
      } else {
        if (requestedGroups.length > 0) {
          const groups = await sdk.groups.getBulk(requestedGroups, {
            enriched: false,
          })
          if (
            groups.length !== requestedGroups.length ||
            groups.some(g => g.scimInfo?.isSync)
          ) {
            ctx.throw(404, "Group not found or managed by SCIM")
          }
        }
      }
    }
  }
  const base = cloneDeep(ctx.request.body)
  ctx = await sdk.publicApi.users.roleCheck(ctx, user)
  const requestedApps = ctx.request.body.builder?.apps
  validateGlobalRoleUpdate(ctx, {
    admin: !!ctx.request.body.admin?.global !== !!user?.admin?.global,
    builder: !!ctx.request.body.builder?.global !== !!user?.builder?.global,
  })
  validateBuilderAppUpdate({
    ctx,
    requestedApps,
    currentBuilder: user?.builder,
  })
  validateRolesUpdate({
    ctx,
    requestedRoles: ctx.request.body.roles,
    currentRoles: user?.roles,
  })
  // check the ctx before any updates to it
  const removed = rolesRemoved(base, ctx)
  if (user && ctx.request.body.roles === undefined) {
    ctx.request.body.roles = user.roles || {}
  }
  ctx = publicApiUserFix(ctx)

  const hasGroupChanges = groupsToRemove.length > 0 || groupsToAdd.length > 0
  let response
  if (user && hasGroupChanges) {
    delete ctx.request.body.userGroups
    response = await saveGlobalUser(ctx)

    for (const groupId of groupsToRemove) {
      await sdk.groups.removeUsers(groupId, [user._id!])
    }
    for (const groupId of groupsToAdd) {
      await sdk.groups.addUsers(groupId, [user._id!])
    }
  } else {
    const skipDefaultGroup = !user && ctx.request.body.userGroups?.length === 0
    response = await saveGlobalUser(
      ctx,
      skipDefaultGroup ? { assignDefaultGroup: false } : undefined
    )
  }

  ctx.body = await getUser(ctx, response._id)
  if (removed) {
    ctx.extra = { message: NO_ROLES_MSG }
  }
  return ctx
}

function isLoggedInUser(ctx: UserCtx, user: User) {
  const loggedInId = ctx.user?._id
  const globalUserId = dbCore.getGlobalIDFromUserMetadataID(loggedInId!)
  // check both just incase
  return globalUserId === user._id || loggedInId === user._id
}

function getUser(ctx: UserCtx, userId?: string) {
  if (userId) {
    ctx.params = { userId }
  } else if (!ctx.params?.userId) {
    throw new Error("No user ID provided for getting")
  }
  return readGlobalUser(ctx)
}

export async function search(ctx: UserCtx, next: Next) {
  const { name } = ctx.request.body
  const users = await allGlobalUsers(ctx)
  ctx.body = stringSearch(users, name, "email")
  await next()
}

export async function create(ctx: UserCtx, next: Next) {
  await createUpdateResponse(ctx)
  await next()
}

export async function read(ctx: UserCtx, next: Next) {
  ctx.body = await readGlobalUser(ctx)
  await next()
}

export async function update(ctx: UserCtx, next: Next) {
  const user = await readGlobalUser(ctx)
  ctx.request.body = {
    ...ctx.request.body,
    _rev: user._rev,
  }
  await createUpdateResponse(ctx, user)
  await next()
}

export async function destroy(ctx: UserCtx, next: Next) {
  const user = await getUser(ctx)
  // disallow deleting yourself
  if (isLoggedInUser(ctx, user)) {
    ctx.throw(405, "Cannot delete user using its own API key.")
  }
  await deleteGlobalUser(ctx)
  ctx.body = user
  await next()
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
