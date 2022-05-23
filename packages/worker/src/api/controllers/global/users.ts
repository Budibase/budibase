const {
  getGlobalUserParams,
  StaticDatabases,
} = require("@budibase/backend-core/db")
const { getGlobalUserByEmail } = require("@budibase/backend-core/utils")
const { user: userCache } = require("@budibase/backend-core/cache")
const { invalidateSessions } = require("@budibase/backend-core/sessions")
const accounts = require("@budibase/backend-core/accounts")
const {
  getGlobalDB,
  doWithGlobalDB,
  getTenantId,
  getTenantUser,
  doesTenantExist,
} = require("@budibase/backend-core/tenancy")
const { removeUserFromInfoDB } = require("@budibase/backend-core/deprovision")
const { errors } = require("@budibase/backend-core")
const { CacheKeys, bustCache } = require("@budibase/backend-core/cache")
import env from "../../../environment"
import { syncUserInApps } from "../../../utilities/appService"
import { quotas, users } from "@budibase/pro"
import { allUsers, getUser } from "../../utilities"
import { EmailTemplatePurpose } from "../../../constants"
import { checkInviteCode } from "../../../utilities/redis"
import { sendEmail } from "../../../utilities/email"

export const save = async (ctx: any) => {
  try {
    const user: any = await users.save(ctx.request.body, getTenantId())
    // let server know to sync user
    await syncUserInApps(user._id)
    ctx.body = user
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

const parseBooleanParam = (param: any) => {
  return !(param && param === "false")
}

export const adminUser = async (ctx: any) => {
  const { email, password, tenantId } = ctx.request.body

  // account portal sends a pre-hashed password - honour param to prevent double hashing
  const hashPassword = parseBooleanParam(ctx.request.query.hashPassword)
  // account portal sends no password for SSO users
  const requirePassword = parseBooleanParam(ctx.request.query.requirePassword)

  if (await doesTenantExist(tenantId)) {
    ctx.throw(403, "Organisation already exists.")
  }

  const response = await doWithGlobalDB(tenantId, async (db: any) => {
    const response = await db.allDocs(
      getGlobalUserParams(null, {
        include_docs: true,
      })
    )
    // write usage quotas for cloud
    if (!env.SELF_HOSTED) {
      // could be a scenario where it exists, make sure its clean
      try {
        const usageQuota = await db.get(StaticDatabases.GLOBAL.docs.usageQuota)
        if (usageQuota) {
          await db.remove(usageQuota._id, usageQuota._rev)
        }
      } catch (err) {
        // don't worry about errors
      }
      await db.put(quotas.generateNewQuotaUsage())
    }
    return response
  })

  if (response.rows.some((row: any) => row.doc.admin)) {
    ctx.throw(
      403,
      "You cannot initialise once an global user has been created."
    )
  }

  const user = {
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
    const finalUser = await users.save(
      user,
      tenantId,
      hashPassword,
      requirePassword
    )
    await bustCache(CacheKeys.CHECKLIST)
    ctx.body = finalUser
  } catch (err: any) {
    ctx.throw(err.status || 400, err)
  }
}

export const destroy = async (ctx: any) => {
  const db = getGlobalDB()
  const dbUser = await db.get(ctx.params.id)

  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    // root account holder can't be deleted from inside budibase
    const email = dbUser.email
    const account = await accounts.getAccount(email)
    if (account) {
      if (email === ctx.user.email) {
        ctx.throw(400, 'Please visit "Account" to delete this user')
      } else {
        ctx.throw(400, "Account holder cannot be deleted")
      }
    }
  }

  await removeUserFromInfoDB(dbUser)
  await db.remove(dbUser._id, dbUser._rev)
  await quotas.removeUser(dbUser)
  await userCache.invalidateUser(dbUser._id)
  await invalidateSessions(dbUser._id)
  // let server know to sync user
  await syncUserInApps(dbUser._id)
  ctx.body = {
    message: `User ${ctx.params.id} deleted.`,
  }
}

// called internally by app server user fetch
export const fetch = async (ctx: any) => {
  const all = await allUsers()
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
  ctx.body = await getUser(ctx.params.id)
}

export const tenantUserLookup = async (ctx: any) => {
  const id = ctx.params.id
  const user = await getTenantUser(id)
  if (user) {
    ctx.body = user
  } else {
    ctx.throw(400, "No tenant user found.")
  }
}

export const invite = async (ctx: any) => {
  let { email, userInfo } = ctx.request.body
  const existing = await getGlobalUserByEmail(email)
  if (existing) {
    ctx.throw(400, "Email address already in use.")
  }
  if (!userInfo) {
    userInfo = {}
  }
  userInfo.tenantId = getTenantId()
  const opts: any = {
    subject: "{{ company }} platform invitation",
    info: userInfo,
  }
  await sendEmail(email, EmailTemplatePurpose.INVITATION, opts)
  ctx.body = {
    message: "Invitation has been sent.",
  }
}

export const inviteAccept = async (ctx: any) => {
  const { inviteCode, password, firstName, lastName } = ctx.request.body
  try {
    // info is an extension of the user object that was stored by global
    const { email, info }: any = await checkInviteCode(inviteCode)
    ctx.body = await users.save(
      {
        firstName,
        lastName,
        password,
        email,
        ...info,
      },
      info.tenantId
    )
  } catch (err: any) {
    if (err.code === errors.codes.USAGE_LIMIT_EXCEEDED) {
      // explicitly re-throw limit exceeded errors
      ctx.throw(400, err)
    }
    ctx.throw(400, "Unable to create new user, invitation invalid.")
  }
}
