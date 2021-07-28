const {
  generateGlobalUserID,
  getGlobalUserParams,
} = require("@budibase/auth/db")
const { hash, getGlobalUserByEmail } = require("@budibase/auth").utils
const {
  doesTenantExist,
  getTenantId,
  doInTenantContext,
  getGlobalDB,
  tryAddTenant,
} = require("@budibase/auth").tenancy
const { UserStatus, EmailTemplatePurpose } = require("../../../constants")
const { checkInviteCode } = require("../../../utilities/redis")
const { sendEmail } = require("../../../utilities/email")
const { user: userCache } = require("@budibase/auth/cache")
const { invalidateSessions } = require("@budibase/auth/sessions")

async function allUsers() {
  const db = getGlobalDB()
  const response = await db.allDocs(
    getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map(row => row.doc)
}

async function saveUser(user) {
  const db = getGlobalDB()
  let { email, password, _id } = user
  // make sure another user isn't using the same email
  let dbUser
  if (email) {
    dbUser = await getGlobalUserByEmail(email)
    if (dbUser != null && (dbUser._id !== _id || Array.isArray(dbUser))) {
      throw "Email address already in use."
    }
  } else {
    dbUser = await db.get(_id)
  }

  // get the password, make sure one is defined
  let hashedPassword
  if (password) {
    hashedPassword = await hash(password)
  } else if (dbUser) {
    hashedPassword = dbUser.password
  } else {
    throw "Password must be specified."
  }

  _id = _id || generateGlobalUserID()
  user = {
    ...dbUser,
    ...user,
    _id,
    password: hashedPassword,
    tenantId: getTenantId(),
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
    await tryAddTenant(getTenantId(), _id, email)
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
    ctx.body = await saveUser(ctx.request.body)
  } catch (err) {
    ctx.throw(err.status || 400, err)
  }
}

exports.createAdmin = async ctx => {
  const { email, password } = ctx.request.body

  const db = getGlobalDB()
  const response = await db.allDocs(
    getGlobalUserParams(null, {
      include_docs: true,
    })
  )

  if (response.rows.some(row => row.doc.admin)) {
    ctx.throw(
      403,
      "You cannot initialise once an global user has been created."
    )
  }

  const user = {
    email: email,
    password: password,
    roles: {},
    builder: {
      global: true,
    },
    admin: {
      global: true,
    },
    tenantId: getTenantId(),
  }
  try {
    return await saveUser(user)
  } catch (err) {
    ctx.throw(err.status || 400, err)
  }
}

exports.initTenant = async ctx => {
  const { tenantId } = ctx.request.body

  if (await doesTenantExist(tenantId)) {
    ctx.throw(403, "Organisation already exists.")
  }

  ctx.body = await doInTenantContext(tenantId, async () => {
    return await this.createAdmin(ctx)
  })
}

exports.destroy = async ctx => {
  const db = getGlobalDB()
  const dbUser = await db.get(ctx.params.id)
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
    // only pass through certain props for accepting
    ctx.request.body = {
      firstName,
      lastName,
      password,
      email,
      ...info,
    }
    ctx.user = {
      tenantId: info.tenantId,
    }
    // this will flesh out the body response
    await exports.save(ctx)
  } catch (err) {
    ctx.throw(400, "Unable to create new user, invitation invalid.")
  }
}
