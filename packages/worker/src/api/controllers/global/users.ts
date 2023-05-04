import {
  checkInviteCode,
  getInviteCodes,
  updateInviteCode,
} from "../../../utilities/redis"
import * as userSdk from "../../../sdk/users"
import env from "../../../environment"
import {
  AcceptUserInviteRequest,
  AcceptUserInviteResponse,
  BulkUserRequest,
  BulkUserResponse,
  CloudAccount,
  CreateAdminUserRequest,
  CreateAdminUserResponse,
  Ctx,
  InviteUserRequest,
  InviteUsersRequest,
  MigrationType,
  SaveUserResponse,
  SearchUsersRequest,
  User,
  UserCtx,
} from "@budibase/types"
import {
  accounts,
  cache,
  events,
  migrations,
  tenancy,
  platform,
  ErrorCode,
} from "@budibase/backend-core"
import { checkAnyUserExists } from "../../../utilities/users"
import { isEmailConfigured } from "../../../utilities/email"

const MAX_USERS_UPLOAD_LIMIT = 1000

export const save = async (ctx: UserCtx<User, SaveUserResponse>) => {
  try {
    const currentUserId = ctx.user._id
    const requestUser = ctx.request.body

    const user = await userSdk.save(requestUser, { currentUserId })

    ctx.body = {
      _id: user._id!,
      _rev: user._rev!,
      email: user.email,
    }
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

const bulkDelete = async (userIds: string[], currentUserId: string) => {
  if (userIds?.indexOf(currentUserId) !== -1) {
    throw new Error("Unable to delete self.")
  }
  return await userSdk.bulkDelete(userIds)
}

const bulkCreate = async (users: User[], groupIds: string[]) => {
  if (!env.SELF_HOSTED && users.length > MAX_USERS_UPLOAD_LIMIT) {
    throw new Error(
      "Max limit for upload is 1000 users. Please reduce file size and try again."
    )
  }
  return await userSdk.bulkCreate(users, groupIds)
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

export const adminUser = async (
  ctx: Ctx<CreateAdminUserRequest, CreateAdminUserResponse>
) => {
  const { email, password, tenantId } = ctx.request.body

  if (await platform.tenants.exists(tenantId)) {
    ctx.throw(403, "Organisation already exists.")
  }

  if (env.MULTI_TENANCY) {
    // store the new tenant record in the platform db
    await platform.tenants.addTenant(tenantId)
    await migrations.backPopulateMigrations({
      type: MigrationType.GLOBAL,
      tenantId,
    })
  }

  await tenancy.doInTenant(tenantId, async () => {
    // account portal sends a pre-hashed password - honour param to prevent double hashing
    const hashPassword = parseBooleanParam(ctx.request.query.hashPassword)
    // account portal sends no password for SSO users
    const requirePassword = parseBooleanParam(ctx.request.query.requirePassword)

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
      await cache.bustCache(cache.CacheKey.CHECKLIST)
      const finalUser = await userSdk.save(user, {
        hashPassword,
        requirePassword,
      })

      // events
      let account: CloudAccount | undefined
      if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
        account = await accounts.getAccountByTenantId(tenantId)
      }
      await events.identification.identifyTenantGroup(tenantId, account)

      ctx.body = {
        _id: finalUser._id!,
        _rev: finalUser._rev!,
        email: finalUser.email,
      }
    } catch (err: any) {
      ctx.throw(err.status || 400, err)
    }
  })
}

export const countByApp = async (ctx: any) => {
  const appId = ctx.params.appId
  try {
    ctx.body = await userSdk.countUsersByApp(appId)
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

export const destroy = async (ctx: any) => {
  const id = ctx.params.id
  if (id === ctx.user._id) {
    ctx.throw(400, "Unable to delete self.")
  }

  await userSdk.destroy(id)

  ctx.body = {
    message: `User ${id} deleted.`,
  }
}

export const getAppUsers = async (ctx: any) => {
  const body = ctx.request.body as SearchUsersRequest
  const users = await userSdk.getUsersByAppAccess(body?.appId)

  ctx.body = { data: users }
}

export const search = async (ctx: any) => {
  const body = ctx.request.body as SearchUsersRequest

  if (body.paginated === false) {
    await getAppUsers(ctx)
  } else {
    const paginated = await userSdk.core.paginatedUsers(body)
    // user hashed password shouldn't ever be returned
    for (let user of paginated.data) {
      if (user) {
        delete user.password
      }
    }
    ctx.body = paginated
  }
}

// called internally by app server user fetch
export const fetch = async (ctx: any) => {
  const all = await userSdk.allUsers()
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
  ctx.body = await userSdk.getUser(ctx.params.id)
}

export const tenantUserLookup = async (ctx: any) => {
  const id = ctx.params.id
  const user = await userSdk.getPlatformUser(id)
  if (user) {
    ctx.body = user
  } else {
    ctx.throw(400, "No tenant user found.")
  }
}

/* 
  Encapsulate the app user onboarding flows here.
*/
export const onboardUsers = async (ctx: any) => {
  const request = ctx.request.body as InviteUsersRequest | BulkUserRequest
  const isBulkCreate = "create" in request

  const emailConfigured = await isEmailConfigured()

  let onboardingResponse

  if (isBulkCreate) {
    // @ts-ignore
    const { users, groups, roles } = request.create
    const assignUsers = users.map((user: User) => (user.roles = roles))
    onboardingResponse = await userSdk.bulkCreate(assignUsers, groups)
    ctx.body = onboardingResponse
  } else if (emailConfigured) {
    onboardingResponse = await inviteMultiple(ctx)
  } else if (!emailConfigured) {
    const inviteRequest = ctx.request.body as InviteUsersRequest

    let createdPasswords: any = {}

    const users: User[] = inviteRequest.map(invite => {
      let password = Math.random().toString(36).substring(2, 22)

      // Temp password to be passed to the user.
      createdPasswords[invite.email] = password

      return {
        email: invite.email,
        password,
        forceResetPassword: true,
        roles: invite.userInfo.apps,
        admin: { global: false },
        builder: { global: false },
        tenantId: tenancy.getTenantId(),
      }
    })
    let bulkCreateReponse = await userSdk.bulkCreate(users, [])

    // Apply temporary credentials
    let createWithCredentials = {
      ...bulkCreateReponse,
      successful: bulkCreateReponse?.successful.map(user => {
        return {
          ...user,
          password: createdPasswords[user.email],
        }
      }),
      created: true,
    }

    ctx.body = createWithCredentials
  } else {
    ctx.throw(400, "User onboarding failed")
  }
}

export const invite = async (ctx: any) => {
  const request = ctx.request.body as InviteUserRequest

  let multiRequest = [request] as InviteUsersRequest
  const response = await userSdk.invite(multiRequest)

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
    successful: response.successful,
    unsuccessful: response.unsuccessful,
  }
}

export const inviteMultiple = async (ctx: any) => {
  const request = ctx.request.body as InviteUsersRequest
  ctx.body = await userSdk.invite(request)
}

export const checkInvite = async (ctx: any) => {
  const { code } = ctx.params
  let invite
  try {
    invite = await checkInviteCode(code, false)
  } catch (e) {
    console.warn("Error getting invite from code", e)
    ctx.throw(400, "There was a problem with the invite")
  }
  ctx.body = {
    email: invite.email,
  }
}

export const getUserInvites = async (ctx: any) => {
  let invites
  try {
    // Restricted to the currently authenticated tenant
    invites = await getInviteCodes()
  } catch (e) {
    ctx.throw(400, "There was a problem fetching invites")
  }
  ctx.body = invites
}

export const updateInvite = async (ctx: any) => {
  const { code } = ctx.params
  let updateBody = { ...ctx.request.body }

  delete updateBody.email

  let invite
  try {
    invite = await checkInviteCode(code, false)
    if (!invite) {
      throw new Error("The invite could not be retrieved")
    }
  } catch (e) {
    ctx.throw(400, "There was a problem with the invite")
  }

  let updated = {
    ...invite,
  }

  if (!updateBody?.apps || !Object.keys(updateBody?.apps).length) {
    updated.info.apps = []
  } else {
    updated.info = {
      ...invite.info,
      apps: {
        ...invite.info.apps,
        ...updateBody.apps,
      },
    }
  }

  await updateInviteCode(code, updated)
  ctx.body = { ...invite }
}

export const inviteAccept = async (
  ctx: Ctx<AcceptUserInviteRequest, AcceptUserInviteResponse>
) => {
  const { inviteCode, password, firstName, lastName } = ctx.request.body
  try {
    // info is an extension of the user object that was stored by global
    const { email, info }: any = await checkInviteCode(inviteCode)
    const user = await tenancy.doInTenant(info.tenantId, async () => {
      let request = {
        firstName,
        lastName,
        password,
        email,
        roles: info.apps,
        tenantId: info.tenantId,
      }

      delete info.apps

      request = {
        ...request,
        ...info,
      }

      const saved = await userSdk.save(request)
      const db = tenancy.getGlobalDB()
      const user = await db.get(saved._id)
      await events.user.inviteAccepted(user)
      return saved
    })

    ctx.body = {
      _id: user._id!,
      _rev: user._rev!,
      email: user.email,
    }
  } catch (err: any) {
    if (err.code === ErrorCode.USAGE_LIMIT_EXCEEDED) {
      // explicitly re-throw limit exceeded errors
      ctx.throw(400, err)
      return
    }
    console.warn("Error inviting user", err)
    ctx.throw(400, "Unable to create new user, invitation invalid.")
  }
}
