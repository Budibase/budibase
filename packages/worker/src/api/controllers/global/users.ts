import { checkInviteCode } from "../../../utilities/redis"
import sdk from "../../../sdk"
import env from "../../../environment"
import {
  BulkUserRequest,
  BulkUserResponse,
  CloudAccount,
  InviteUserRequest,
  InviteUsersRequest,
  SearchUsersRequest,
  User,
} from "@budibase/types"
import {
  accounts,
  cache,
  errors,
  events,
  tenancy,
} from "@budibase/backend-core"
import { checkAnyUserExists } from "../../../utilities/users"

const MAX_USERS_UPLOAD_LIMIT = 1000

export const save = async (ctx: any) => {
  try {
    ctx.body = await sdk.users.save(ctx.request.body)
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

const bulkDelete = async (userIds: string[], currentUserId: string) => {
  if (userIds?.indexOf(currentUserId) !== -1) {
    throw new Error("Unable to delete self.")
  }
  return await sdk.users.bulkDelete(userIds)
}

const bulkCreate = async (users: User[], groupIds: string[]) => {
  if (!env.SELF_HOSTED && users.length > MAX_USERS_UPLOAD_LIMIT) {
    throw new Error(
      "Max limit for upload is 1000 users. Please reduce file size and try again."
    )
  }
  return await sdk.users.bulkCreate(users, groupIds)
}

export const bulkUpdate = async (ctx: any) => {
  const currentUserId = ctx.user._id
  const input = ctx.request.body as BulkUserRequest
  let created, deleted
  try {
    if (input.create) {
      created = await bulkCreate(input.create.users, input.create.groups)
    }
    if (input.delete) {
      deleted = await bulkDelete(input.delete.userIds, currentUserId)
    }
  } catch (err: any) {
    ctx.throw(err.status || 400, err?.message || err)
  }
  ctx.body = { created, deleted } as BulkUserResponse
}

const parseBooleanParam = (param: any) => {
  return !(param && param === "false")
}

export const adminUser = async (ctx: any) => {
  const { email, password, tenantId } = ctx.request.body
  await tenancy.doInTenant(tenantId, async () => {
    // account portal sends a pre-hashed password - honour param to prevent double hashing
    const hashPassword = parseBooleanParam(ctx.request.query.hashPassword)
    // account portal sends no password for SSO users
    const requirePassword = parseBooleanParam(ctx.request.query.requirePassword)

    if (await tenancy.doesTenantExist(tenantId)) {
      ctx.throw(403, "Organisation already exists.")
    }

    const userExists = await checkAnyUserExists()
    if (userExists) {
      ctx.throw(
        403,
        "You cannot initialise once an global user has been created."
      )
    }

    const user: User = {
      email: email,
      password: password,
      createdAt: Date.now(),
      roles: {},
      builder: {
        global: true,
      },
      admin: {
        global: true,
      },
      tenantId,
    }
    try {
      // always bust checklist beforehand, if an error occurs but can proceed, don't get
      // stuck in a cycle
      await cache.bustCache(cache.CacheKeys.CHECKLIST)
      const finalUser = await sdk.users.save(user, {
        hashPassword,
        requirePassword,
      })

      // events
      let account: CloudAccount | undefined
      if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
        account = await accounts.getAccountByTenantId(tenantId)
      }
      await events.identification.identifyTenantGroup(tenantId, account)

      ctx.body = finalUser
    } catch (err: any) {
      ctx.throw(err.status || 400, err)
    }
  })
}

export const countByApp = async (ctx: any) => {
  const appId = ctx.params.appId
  try {
    ctx.body = await sdk.users.countUsersByApp(appId)
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

export const destroy = async (ctx: any) => {
  const id = ctx.params.id
  if (id === ctx.user._id) {
    ctx.throw(400, "Unable to delete self.")
  }

  await sdk.users.destroy(id, ctx.user)

  ctx.body = {
    message: `User ${id} deleted.`,
  }
}

export const search = async (ctx: any) => {
  const body = ctx.request.body as SearchUsersRequest
  const paginated = await sdk.users.paginatedUsers(body)
  // user hashed password shouldn't ever be returned
  for (let user of paginated.data) {
    if (user) {
      delete user.password
    }
  }
  ctx.body = paginated
}

// called internally by app server user fetch
export const fetch = async (ctx: any) => {
  const all = await sdk.users.allUsers()
  // user hashed password shouldn't ever be returned
  for (let user of all) {
    if (user) {
      delete user.password
    }
  }
  ctx.body = all
}

// called internally by app server user find
export const find = async (ctx: any) => {
  ctx.body = await sdk.users.getUser(ctx.params.id)
}

export const tenantUserLookup = async (ctx: any) => {
  const id = ctx.params.id
  const user = await tenancy.getTenantUser(id)
  if (user) {
    ctx.body = user
  } else {
    ctx.throw(400, "No tenant user found.")
  }
}

export const invite = async (ctx: any) => {
  const request = ctx.request.body as InviteUserRequest
  const response = await sdk.users.invite([request])

  // explicitly throw for single user invite
  if (response.unsuccessful.length) {
    const reason = response.unsuccessful[0].reason
    if (reason === "Unavailable") {
      ctx.throw(400, reason)
    } else {
      ctx.throw(500, reason)
    }
  }

  ctx.body = {
    message: "Invitation has been sent.",
  }
}

export const inviteMultiple = async (ctx: any) => {
  const request = ctx.request.body as InviteUsersRequest
  ctx.body = await sdk.users.invite(request)
}

export const inviteAccept = async (ctx: any) => {
  const { inviteCode, password, firstName, lastName } = ctx.request.body
  try {
    // info is an extension of the user object that was stored by global
    const { email, info }: any = await checkInviteCode(inviteCode)
    ctx.body = await tenancy.doInTenant(info.tenantId, async () => {
      const saved = await sdk.users.save({
        firstName,
        lastName,
        password,
        email,
        ...info,
      })
      const db = tenancy.getGlobalDB()
      const user = await db.get(saved._id)
      await events.user.inviteAccepted(user)
      return saved
    })
  } catch (err: any) {
    if (err.code === errors.codes.USAGE_LIMIT_EXCEEDED) {
      // explicitly re-throw limit exceeded errors
      ctx.throw(400, err)
    }
    ctx.throw(400, "Unable to create new user, invitation invalid.")
  }
}
