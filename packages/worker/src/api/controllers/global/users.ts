import * as userSdk from "../../../sdk/users"
import env from "../../../environment"
import {
  AcceptUserInviteRequest,
  AcceptUserInviteResponse,
  AddSSoUserRequest,
  AddSSoUserResponse,
  BulkUserRequest,
  BulkUserResponse,
  CheckInviteResponse,
  CountUserResponse,
  CreateAdminUserRequest,
  CreateAdminUserResponse,
  Ctx,
  DeleteInviteUserRequest,
  DeleteInviteUsersRequest,
  DeleteInviteUsersResponse,
  DeleteUserResponse,
  FetchUsersResponse,
  FindUserResponse,
  GetUserInvitesResponse,
  Hosting,
  InviteUserRequest,
  InviteUserResponse,
  InviteUsersRequest,
  InviteUsersResponse,
  LockName,
  LockType,
  LookupAccountHolderResponse,
  LookupTenantUserResponse,
  MigrationType,
  PlatformUserByEmail,
  SaveUserResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UnsavedUser,
  UpdateInviteRequest,
  UpdateInviteResponse,
  User,
  UserCtx,
  UserIdentifier,
} from "@budibase/types"
import {
  users,
  cache,
  ErrorCode,
  events,
  migrations,
  platform,
  tenancy,
  db,
  locks,
  context,
} from "@budibase/backend-core"
import { checkAnyUserExists } from "../../../utilities/users"
import { isEmailConfigured } from "../../../utilities/email"
import { BpmStatusKey, BpmStatusValue, utils } from "@budibase/shared-core"
import emailValidator from "email-validator"
import crypto from "crypto"

const MAX_USERS_UPLOAD_LIMIT = 1000

const generatePassword = (length: number) => {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, length)
}

export const save = async (ctx: UserCtx<UnsavedUser, SaveUserResponse>) => {
  try {
    const currentUserId = ctx.user?._id
    const tenantId = context.getTenantId()
    const requestUser: User = { ...ctx.request.body, tenantId }

    // Do not allow the account holder role to be changed
    if (
      requestUser.admin?.global !== true ||
      requestUser.builder?.global !== true
    ) {
      const accountMetadata = await users.getExistingAccounts([
        requestUser.email,
      ])
      if (accountMetadata?.length > 0) {
        throw Error("Cannot set role of account holder")
      }
    }

    const user = await userSdk.db.save(requestUser, { currentUserId })

    ctx.body = {
      _id: user._id!,
      _rev: user._rev!,
      email: user.email,
    }
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

export const addSsoSupport = async (
  ctx: Ctx<AddSSoUserRequest, AddSSoUserResponse>
) => {
  const { email, ssoId } = ctx.request.body
  try {
    // Status is changed to 404 from getUserDoc if user is not found
    const userByEmail = (await platform.users.getUserDoc(
      email
    )) as PlatformUserByEmail
    await platform.users.addSsoUser(
      ssoId,
      email,
      userByEmail.userId,
      userByEmail.tenantId
    )
    // Need to get the _rev of the user doc to update
    const userById = await platform.users.getUserDoc(userByEmail.userId)
    await platform.users.updateUserDoc({
      ...userById,
      email,
      ssoId,
    })
    ctx.body = { message: "SSO support added." }
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

const bulkDelete = async (
  users: Array<UserIdentifier>,
  currentUserId: string
) => {
  if (users.find(u => u.userId === currentUserId)) {
    throw new Error("Unable to delete self.")
  }
  return await userSdk.db.bulkDelete(users)
}

const bulkCreate = async (users: User[], groupIds: string[]) => {
  if (!env.SELF_HOSTED && users.length > MAX_USERS_UPLOAD_LIMIT) {
    throw new Error(
      "Max limit for upload is 1000 users. Please reduce file size and try again."
    )
  }
  return await userSdk.db.bulkCreate(users, groupIds)
}

export const bulkUpdate = async (
  ctx: Ctx<BulkUserRequest, BulkUserResponse>
) => {
  const currentUserId = ctx.user._id
  const input = ctx.request.body
  let created, deleted
  try {
    if (input.create) {
      const tenantId = context.getTenantId()
      const users: User[] = input.create.users.map(user => ({
        ...user,
        tenantId,
      }))
      created = await bulkCreate(users, input.create.groups)
    }
    if (input.delete) {
      deleted = await bulkDelete(input.delete.users, currentUserId)
    }
  } catch (err: any) {
    ctx.throw(err.status || 400, err?.message || err)
  }
  ctx.body = { created, deleted }
}

const parseBooleanParam = (param: any) => {
  return !(param && param === "false")
}

export const adminUser = async (
  ctx: Ctx<CreateAdminUserRequest, CreateAdminUserResponse>
) => {
  const { email, password, tenantId, ssoId, givenName, familyName } =
    ctx.request.body

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

    try {
      const finalUser = await userSdk.db.createAdminUser(email, tenantId, {
        password,
        ssoId,
        hashPassword,
        requirePassword,
        firstName: givenName,
        lastName: familyName,
      })

      await events.identification.identifyTenantGroup(
        tenantId,
        env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
      )

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

export const countByApp = async (ctx: UserCtx<void, CountUserResponse>) => {
  const appId = ctx.params.appId
  try {
    ctx.body = await userSdk.db.countUsersByApp(appId)
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

export const destroy = async (ctx: UserCtx<void, DeleteUserResponse>) => {
  const id = ctx.params.id
  if (id === ctx.user._id) {
    ctx.throw(400, "Unable to delete self.")
  }

  await userSdk.db.destroy(id)

  ctx.body = {
    message: `User ${id} deleted.`,
  }
}

export const getAppUsers = async (ctx: Ctx<SearchUsersRequest>) => {
  const body = ctx.request.body
  const users = await userSdk.db.getUsersByAppAccess({
    appId: body.appId,
    limit: body.limit,
  })

  ctx.body = { data: users }
}

export const search = async (
  ctx: Ctx<SearchUsersRequest, SearchUsersResponse>
) => {
  const body = ctx.request.body

  // TODO: for now only two supported search keys; string.email and equal._id
  if (body?.query) {
    // Clean numeric prefixing. This will overwrite duplicate search fields,
    // but this is fine because we only support a single custom search on
    // email and id
    for (let filters of Object.values(body.query)) {
      if (filters && typeof filters === "object") {
        for (let [field, value] of Object.entries(filters)) {
          delete filters[field]
          const cleanedField = db.removeKeyNumbering(field)
          if (filters[cleanedField] !== undefined) {
            ctx.throw(400, "Only 1 filter per field is supported")
          }
          filters[cleanedField] = value
        }
      }
    }
    // Validate we aren't trying to search on any illegal fields
    if (!utils.isSupportedUserSearch(body.query)) {
      ctx.throw(400, "Can only search by string.email, equal._id or oneOf._id")
    }
  }

  if (body.paginate === false) {
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
export const fetch = async (ctx: UserCtx<void, FetchUsersResponse>) => {
  const all = await userSdk.db.allUsers()
  // user hashed password shouldn't ever be returned
  for (let user of all) {
    if (user) {
      delete user.password
    }
  }
  ctx.body = all
}

// called internally by app server user find
export const find = async (ctx: UserCtx<void, FindUserResponse>) => {
  ctx.body = await userSdk.db.getUser(ctx.params.id)
}

export const tenantUserLookup = async (
  ctx: UserCtx<void, LookupTenantUserResponse>
) => {
  const id = ctx.params.id
  // is email, check its valid
  if (id.includes("@") && !emailValidator.validate(id)) {
    ctx.throw(400, `${id} is not a valid email address to lookup.`)
  }
  const user = await userSdk.core.getFirstPlatformUser(id)
  if (user) {
    ctx.body = user
  } else {
    ctx.throw(400, "No tenant user found.")
  }
}

/**
 * This will be paginated to a default of the first 50 users,
 * So the account holder may not be found until further pagination has occurred
 */
export const accountHolderLookup = async (
  ctx: Ctx<void, LookupAccountHolderResponse>
) => {
  try {
    const users = await userSdk.core.getAllUsers()
    const response = await userSdk.core.getExistingAccounts(
      users.map(u => u.email)
    )
    const holder = response[0]
    if (!holder) {
      ctx.body = null
      return
    }
    holder._id = users.find(u => u.email === holder.email)?._id
    ctx.body = holder
  } catch (e) {
    ctx.body = null
  }
}

/* 
  Encapsulate the app user onboarding flows here.
*/
export const onboardUsers = async (
  ctx: Ctx<InviteUsersRequest, InviteUsersResponse>
) => {
  if (await isEmailConfigured()) {
    await inviteMultiple(ctx)
    return
  }

  let createdPasswords: Record<string, string> = {}
  const users: User[] = ctx.request.body.map(invite => {
    const password = generatePassword(12)
    createdPasswords[invite.email] = password

    return {
      email: invite.email,
      password,
      forceResetPassword: true,
      roles: invite.userInfo.apps,
      admin: invite.userInfo.admin,
      builder: invite.userInfo.builder,
      tenantId: tenancy.getTenantId(),
    }
  })

  let resp = await userSdk.db.bulkCreate(users)
  for (const user of resp.successful) {
    user.password = createdPasswords[user.email]
  }
  ctx.body = { ...resp, created: true }
}

export const invite = async (
  ctx: Ctx<InviteUserRequest, InviteUserResponse>
) => {
  const request = ctx.request.body

  let multiRequest = [request]
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

export const inviteMultiple = async (
  ctx: Ctx<InviteUsersRequest, InviteUsersResponse>
) => {
  ctx.body = await userSdk.invite(ctx.request.body)
}

export const removeMultipleInvites = async (
  ctx: Ctx<DeleteInviteUsersRequest, DeleteInviteUsersResponse>
) => {
  const inviteCodesToRemove = ctx.request.body.map(
    (invite: DeleteInviteUserRequest) => invite.code
  )
  for (const code of inviteCodesToRemove) {
    await cache.invite.deleteCode(code)
  }
  ctx.body = {
    message: "User invites successfully removed.",
  }
}

export const checkInvite = async (ctx: UserCtx<void, CheckInviteResponse>) => {
  const { code } = ctx.params
  let invite
  try {
    invite = await cache.invite.getCode(code)
  } catch (e) {
    console.warn("Error getting invite from code", e)
    ctx.throw(400, "There was a problem with the invite")
  }
  ctx.body = {
    email: invite.email,
  }
}

export const getUserInvites = async (
  ctx: UserCtx<void, GetUserInvitesResponse>
) => {
  try {
    // Restricted to the currently authenticated tenant
    ctx.body = await cache.invite.getInviteCodes()
  } catch (e) {
    ctx.throw(400, "There was a problem fetching invites")
  }
}

export const updateInvite = async (
  ctx: UserCtx<UpdateInviteRequest, UpdateInviteResponse>
) => {
  const { code } = ctx.params
  let updateBody = { ...ctx.request.body }

  delete updateBody.email

  let invite
  try {
    invite = await cache.invite.getCode(code)
  } catch (e) {
    ctx.throw(400, "There was a problem with the invite")
  }

  let updated = {
    ...invite,
  }

  if (!updateBody?.builder?.apps && updated.info?.builder?.apps) {
    updated.info.builder.apps = []
  } else if (updateBody?.builder) {
    updated.info.builder = updateBody.builder
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

  await cache.invite.updateCode(code, updated)
  ctx.body = { ...invite }
}

export const inviteAccept = async (
  ctx: Ctx<AcceptUserInviteRequest, AcceptUserInviteResponse>
) => {
  const { inviteCode, password, firstName, lastName } = ctx.request.body
  try {
    await locks.doWithLock(
      {
        type: LockType.AUTO_EXTEND,
        name: LockName.PROCESS_USER_INVITE,
        resource: inviteCode,
        systemLock: true,
      },
      async () => {
        // info is an extension of the user object that was stored by global
        const { email, info } = await cache.invite.getCode(inviteCode)
        const user = await tenancy.doInTenant(info.tenantId, async () => {
          let request: any = {
            firstName,
            lastName,
            password,
            email,
            admin: { global: info?.admin?.global || false },
            roles: info.apps,
            tenantId: info.tenantId,
          }
          const builder: { global: boolean; apps?: string[] } = {
            global: info?.builder?.global || false,
          }

          if (info?.builder?.apps) {
            builder.apps = info.builder.apps
            request.builder = builder
          }
          delete info.apps
          request = {
            ...request,
            ...info,
          }

          const saved = await userSdk.db.save(request)
          await events.user.inviteAccepted(saved)
          return saved
        })

        await cache.invite.deleteCode(inviteCode)

        // make sure onboarding flow is cleared
        ctx.cookies.set(BpmStatusKey.ONBOARDING, BpmStatusValue.COMPLETED, {
          expires: new Date(0),
        })

        ctx.body = {
          _id: user._id!,
          _rev: user._rev!,
          email: user.email,
          tenantId: user.tenantId,
        }
      }
    )
  } catch (err: any) {
    if (err.code === ErrorCode.USAGE_LIMIT_EXCEEDED) {
      // explicitly re-throw limit exceeded errors
      ctx.throw(400, err)
    }
    console.warn("Error inviting user", err)
    ctx.throw(400, err || "Unable to create new user, invitation invalid.")
  }
}
