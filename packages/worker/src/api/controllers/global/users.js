const {
  generateGlobalUserID,
  getGlobalUserParams,
  StaticDatabases,
  generateNewUsageQuotaDoc,
} = require("@budibase/auth/db")
const { hash, getGlobalUserByEmail } = require("@budibase/auth").utils
const { UserStatus, EmailTemplatePurpose } = require("../../../constants")
const { checkInviteCode } = require("../../../utilities/redis")
const { sendEmail } = require("../../../utilities/email")
const { user: userCache } = require("@budibase/auth/cache")
const { invalidateSessions } = require("@budibase/auth/sessions")
const CouchDB = require("../../../db")
const accounts = require("@budibase/auth/accounts")
const {
  getGlobalDB,
  getTenantId,
  doesTenantExist,
  tryAddTenant,
  updateTenantId,
} = require("@budibase/auth/tenancy")
const { removeUserFromInfoDB } = require("@budibase/auth/deprovision")
const env = require("../../../environment")

const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name

async function allUsers() {
  const db = getGlobalDB()
  const response = await db.allDocs(
    getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map(row => row.doc)
}

async function saveUser(
  user,
  tenantId,
  hashPassword = true,
  requirePassword = true
) {
  if (!tenantId) {
    throw "No tenancy specified."
  }
  // need to set the context for this request, as specified
  updateTenantId(tenantId)
  // specify the tenancy incase we're making a new admin user (public)
  const db = getGlobalDB(tenantId)
  let { email, password, _id } = user
  // make sure another user isn't using the same email
  let dbUser
  if (email) {
    // check budibase users inside the tenant
    dbUser = await getGlobalUserByEmail(email)
    if (dbUser != null && (dbUser._id !== _id || Array.isArray(dbUser))) {
      throw `Email address ${email} already in use.`
    }

    // check budibase users in other tenants
    if (env.MULTI_TENANCY) {
      dbUser = await getTenantUser(email)
      if (dbUser != null) {
        throw `Email address ${email} already in use.`
      }
    }

    // check root account users in account portal
    if (!env.SELF_HOSTED) {
      const account = await accounts.getAccount(email)
      if (account && account.verified) {
        throw `Email address ${email} already in use.`
      }
    }
  } else {
    dbUser = await db.get(_id)
  }

  // get the password, make sure one is defined
  let hashedPassword
  if (password) {
    hashedPassword = hashPassword ? await hash(password) : password
  } else if (dbUser) {
    hashedPassword = dbUser.password
  } else if (requirePassword) {
    throw "Password must be specified."
  }

  _id = _id || generateGlobalUserID()
  user = {
    createdAt: Date.now(),
    ...dbUser,
    ...user,
    _id,
    password: hashedPassword,
    tenantId,
  }
  // make sure the roles object is always present
  if (!user.roles) {
    user.roles = {}
  }
  // add the active status to a user if its not provided
  if (user.status == null) {
    user.status = UserStatus.ACTIVE
  }
  try {
    const response = await db.put({
      password: hashedPassword,
      ...user,
    })
    await tryAddTenant(tenantId, _id, email)
    await userCache.invalidateUser(response.id)
    return {
      _id: response.id,
      _rev: response.rev,
      email,
    }
  } catch (err) {
    if (err.status === 409) {
      throw "User exists already"
    } else {
      throw err
    }
  }
}

exports.save = async ctx => {
  try {
    ctx.body = await saveUser(ctx.request.body, getTenantId())
  } catch (err) {
    ctx.throw(err.status || 400, err)
  }
}

const parseBooleanParam = param => {
  if (param && param == "false") {
    return false
  } else {
    return true
  }
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
    await db.post(generateNewUsageQuotaDoc())
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
  await removeUserFromInfoDB(dbUser)
  await db.remove(dbUser._id, dbUser._rev)
  await userCache.invalidateUser(dbUser._id)
  await invalidateSessions(dbUser._id)
  ctx.body = {
    message: `User ${ctx.params.id} deleted.`,
  }
}

exports.removeAppRole = async ctx => {
  const { appId } = ctx.params
  const db = getGlobalDB()
  const users = await allUsers(ctx)
  const bulk = []
  const cacheInvalidations = []
  for (let user of users) {
    if (user.roles[appId]) {
      cacheInvalidations.push(userCache.invalidateUser(user._id))
      delete user.roles[appId]
      bulk.push(user)
    }
  }
  await db.bulkDocs(bulk)
  await Promise.all(cacheInvalidations)
  ctx.body = {
    message: "App role removed from all users",
  }
}

exports.getSelf = async ctx => {
  if (!ctx.user) {
    ctx.throw(403, "User not logged in")
  }
  ctx.params = {
    id: ctx.user._id,
  }
  // this will set the body
  await exports.find(ctx)

  // forward session information not found in db
  ctx.body.account = ctx.user.account
  ctx.body.budibaseAccess = ctx.user.budibaseAccess
  ctx.body.accountPortalAccess = ctx.user.accountPortalAccess
}

exports.updateSelf = async ctx => {
  const db = getGlobalDB()
  const user = await db.get(ctx.user._id)
  if (ctx.request.body.password) {
    ctx.request.body.password = await hash(ctx.request.body.password)
  }
  // don't allow sending up an ID/Rev, always use the existing one
  delete ctx.request.body._id
  delete ctx.request.body._rev
  const response = await db.put({
    ...user,
    ...ctx.request.body,
  })
  await userCache.invalidateUser(user._id)
  ctx.body = {
    _id: response.id,
    _rev: response.rev,
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
  const db = getGlobalDB()
  let user
  try {
    user = await db.get(ctx.params.id)
  } catch (err) {
    // no user found, just return nothing
    user = {}
  }
  if (user) {
    delete user.password
  }
  ctx.body = user
}

// lookup, could be email or userId, either will return a doc
const getTenantUser = async identifier => {
  const db = new CouchDB(PLATFORM_INFO_DB)
  try {
    return await db.get(identifier)
  } catch (err) {
    return null
  }
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
