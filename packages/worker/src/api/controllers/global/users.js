const {
  getGlobalUserParams,
  StaticDatabases,
  generateNewUsageQuotaDoc,
} = require("@budibase/backend-core/db")
const {
  getGlobalUserByEmail,
  saveUser,
} = require("@budibase/backend-core/utils")
const { EmailTemplatePurpose } = require("../../../constants")
const { checkInviteCode } = require("../../../utilities/redis")
const { sendEmail } = require("../../../utilities/email")
const { user: userCache } = require("@budibase/backend-core/cache")
const { invalidateSessions } = require("@budibase/backend-core/sessions")
const accounts = require("@budibase/backend-core/accounts")
const {
  getGlobalDB,
  getTenantId,
  getTenantUser,
  doesTenantExist,
} = require("@budibase/backend-core/tenancy")
const { removeUserFromInfoDB } = require("@budibase/backend-core/deprovision")
const env = require("../../../environment")
const { syncUserInApps } = require("../../../utilities/appService")
const { allUsers, getUser } = require("../../utilities")

exports.save = async ctx => {
  try {
    const user = await saveUser(ctx.request.body, getTenantId())
    // let server know to sync user
    await syncUserInApps(user._id)
    ctx.body = user
  } catch (err) {
    ctx.throw(err.status || 400, err)
  }
}

const parseBooleanParam = param => {
  return !(param && param === "false")
}

exports.adminUser = async ctx => {
  const { email, password, tenantId } = ctx.request.body

  // account portal sends a pre-hashed password - honour param to prevent double hashing
  const hashPassword = parseBooleanParam(ctx.request.query.hashPassword)
  // account portal sends no password for SSO users
  const requirePassword = parseBooleanParam(ctx.request.query.requirePassword)

  if (await doesTenantExist(tenantId)) {
    ctx.throw(403, "Organisation already exists.")
  }

  const db = getGlobalDB(tenantId)
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
    await db.put(generateNewUsageQuotaDoc())
  }

  if (response.rows.some(row => row.doc.admin)) {
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
    ctx.body = await saveUser(user, tenantId, hashPassword, requirePassword)
  } catch (err) {
    ctx.throw(err.status || 400, err)
  }
}

exports.destroy = async ctx => {
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
  await userCache.invalidateUser(dbUser._id)
  await invalidateSessions(dbUser._id)
  // let server know to sync user
  await syncUserInApps(dbUser._id)
  ctx.body = {
    message: `User ${ctx.params.id} deleted.`,
  }
}

// called internally by app server user fetch
exports.fetch = async ctx => {
  const users = await allUsers(ctx)
  // user hashed password shouldn't ever be returned
  for (let user of users) {
    if (user) {
      delete user.password
    }
  }
  ctx.body = users
}

// called internally by app server user find
exports.find = async ctx => {
  ctx.body = await getUser(ctx.params.id)
}

exports.tenantUserLookup = async ctx => {
  const id = ctx.params.id
  const user = await getTenantUser(id)
  if (user) {
    ctx.body = user
  } else {
    ctx.throw(400, "No tenant user found.")
  }
}

exports.invite = async ctx => {
  let { email, userInfo } = ctx.request.body
  const existing = await getGlobalUserByEmail(email)
  if (existing) {
    ctx.throw(400, "Email address already in use.")
  }
  if (!userInfo) {
    userInfo = {}
  }
  userInfo.tenantId = getTenantId()
  await sendEmail(email, EmailTemplatePurpose.INVITATION, {
    subject: "{{ company }} platform invitation",
    info: userInfo,
  })
  ctx.body = {
    message: "Invitation has been sent.",
  }
}

exports.inviteAccept = async ctx => {
  const { inviteCode, password, firstName, lastName } = ctx.request.body
  try {
    // info is an extension of the user object that was stored by global
    const { email, info } = await checkInviteCode(inviteCode)
    ctx.body = await saveUser(
      {
        firstName,
        lastName,
        password,
        email,
        ...info,
      },
      info.tenantId
    )
  } catch (err) {
    ctx.throw(400, "Unable to create new user, invitation invalid.")
  }
}
