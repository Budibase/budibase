import { EmailTemplatePurpose } from "../../../constants"
import { checkInviteCode } from "../../../utilities/redis"
import { sendEmail } from "../../../utilities/email"
import { users } from "../../../sdk"
import { User } from "@budibase/types"
import { events } from "@budibase/backend-core"
import { getGlobalDB } from "@budibase/backend-core/dist/src/context"

const {
  errors,
  users: usersCore,
  tenancy,
  db: dbUtils,
} = require("@budibase/backend-core")

export const save = async (ctx: any) => {
  try {
    const user = await users.save(ctx.request.body)
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

  if (await tenancy.doesTenantExist(tenantId)) {
    ctx.throw(403, "Organisation already exists.")
  }

  const response = await tenancy.doWithGlobalDB(tenantId, async (db: any) => {
    return db.allDocs(
      dbUtils.getGlobalUserParams(null, {
        include_docs: true,
      })
    )
  })

  if (response.rows.some((row: any) => row.doc.admin)) {
    ctx.throw(403, "You cannot initialise once a global user has been created.")
  }

  const user: User = {
    email: email,
    password: password,
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
    ctx.body = await tenancy.doInTenant(tenantId, async () => {
      return users.save(user, hashPassword, requirePassword)
    })
    await events.identification.identifyTenant(tenantId)
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
  await events.user.invited(userInfo)
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
      const db = getGlobalDB()
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
