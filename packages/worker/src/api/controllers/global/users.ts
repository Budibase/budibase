import { EmailTemplatePurpose } from "../../../constants"
import { checkInviteCode } from "../../../utilities/redis"
import { sendEmail } from "../../../utilities/email"
import { users } from "../../../sdk"
import env from "../../../environment"
import { User, CloudAccount } from "@budibase/types"
import {
  events,
  errors,
  accounts,
  users as usersCore,
  tenancy,
  cache,
} from "@budibase/backend-core"
import { checkAnyUserExists } from "../../../utilities/users"
import { groups as groupUtils } from "@budibase/pro"
const MAX_USERS_UPLOAD_LIMIT = 1000

export const save = async (ctx: any) => {
  try {
    ctx.body = await users.save(ctx.request.body)
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

export const bulkCreate = async (ctx: any) => {
  let { users: newUsersRequested, groups } = ctx.request.body

  if (!env.SELF_HOSTED && newUsersRequested.length > MAX_USERS_UPLOAD_LIMIT) {
    ctx.throw(
      400,
      "Max limit for upload is 1000 users. Please reduce file size and try again."
    )
  }

  const db = tenancy.getGlobalDB()
  let groupsToSave: any[] = []

  if (groups.length) {
    for (const groupId of groups) {
      let oldGroup = await db.get(groupId)
      groupsToSave.push(oldGroup)
    }
  }

  try {
    let response = await users.bulkCreate(newUsersRequested, groups)
    await groupUtils.bulkSaveGroupUsers(groupsToSave, response)

    ctx.body = response
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
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
      const finalUser = await users.save(user, {
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
    const response = await users.countUsersByApp(appId)
    ctx.body = response
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

export const destroy = async (ctx: any) => {
  const id = ctx.params.id

  await users.destroy(id, ctx.user)

  ctx.body = {
    message: `User ${id} deleted.`,
  }
}

export const bulkDelete = async (ctx: any) => {
  const { userIds } = ctx.request.body
  try {
    let usersResponse = await users.bulkDelete(userIds)

    ctx.body = {
      message: `${usersResponse.length} user(s) deleted`,
    }
  } catch (err) {
    ctx.throw(err)
  }
}

export const search = async (ctx: any) => {
  const paginated = await users.paginatedUsers(ctx.request.body)
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
  const all = await users.allUsers()
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
  ctx.body = await users.getUser(ctx.params.id)
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
  let { email, userInfo } = ctx.request.body
  const existing = await usersCore.getGlobalUserByEmail(email)
  if (existing) {
    ctx.throw(400, "Email address already in use.")
  }
  if (!userInfo) {
    userInfo = {}
  }
  userInfo.tenantId = tenancy.getTenantId()
  const opts: any = {
    subject: "{{ company }} platform invitation",
    info: userInfo,
  }
  await sendEmail(email, EmailTemplatePurpose.INVITATION, opts)
  ctx.body = {
    message: "Invitation has been sent.",
  }
  await events.user.invited()
}

export const inviteMultiple = async (ctx: any) => {
  let { emails, userInfo } = ctx.request.body
  let existing = false
  let existingEmail
  for (let email of emails) {
    if (await usersCore.getGlobalUserByEmail(email)) {
      existing = true
      existingEmail = email
      break
    }
  }

  if (existing) {
    ctx.throw(400, `${existingEmail} already exists`)
  }
  if (!userInfo) {
    userInfo = {}
  }
  userInfo.tenantId = tenancy.getTenantId()
  const opts: any = {
    subject: "{{ company }} platform invitation",
    info: userInfo,
  }

  for (let i = 0; i < emails.length; i++) {
    await sendEmail(emails[i], EmailTemplatePurpose.INVITATION, opts)
  }

  ctx.body = {
    message: "Invitations have been sent.",
  }
}

export const inviteAccept = async (ctx: any) => {
  const { inviteCode, password, firstName, lastName } = ctx.request.body
  try {
    // info is an extension of the user object that was stored by global
    const { email, info }: any = await checkInviteCode(inviteCode)
    ctx.body = await tenancy.doInTenant(info.tenantId, async () => {
      const saved = await users.save({
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
