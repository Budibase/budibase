import {
  events,
  HTTPError,
  tenancy,
  users as usersCore,
  UserStatus,
  db as dbUtils,
  utils,
  accounts as accountSdk,
  context,
  env as coreEnv,
} from "@budibase/backend-core"
import {
  Account,
  InviteUsersRequest,
  InviteUsersResponse,
  isSSOAccount,
  isSSOUser,
  SaveUserOpts,
  User,
} from "@budibase/types"
import { sendEmail } from "../../utilities/email"
import { EmailTemplatePurpose } from "../../constants"
import * as pro from "@budibase/pro"

export async function isPreventPasswordActions(user: User, account?: Account) {
  // when in maintenance mode we allow sso users with the admin role
  // to perform any password action - this prevents lockout
  if (coreEnv.ENABLE_SSO_MAINTENANCE_MODE && usersCore.isAdmin(user)) {
    return false
  }

  // SSO is enforced for all users
  if (await pro.features.isSSOEnforced()) {
    return true
  }

  // Check local sso
  if (isSSOUser(user)) {
    return true
  }

  // Check account sso
  if (!account) {
    account = await accountSdk.getAccountByTenantId(context.getTenantId())
  }
  return !!(account && account.email === user.email && isSSOAccount(account))
}

export async function buildUser(
  user: User,
  opts: SaveUserOpts = {
    hashPassword: true,
    requirePassword: true,
  },
  tenantId: string,
  dbUser?: any,
  account?: Account
): Promise<User> {
  let { password, _id } = user

  // don't require a password if the db user doesn't already have one
  if (dbUser && !dbUser.password) {
    opts.requirePassword = false
  }

  let hashedPassword
  if (password) {
    if (await isPreventPasswordActions(user, account)) {
      throw new HTTPError("Password change is disabled for this user", 400)
    }
    hashedPassword = opts.hashPassword ? await utils.hash(password) : password
  } else if (dbUser) {
    hashedPassword = dbUser.password
  }

  // passwords are never required if sso is enforced
  const requirePasswords =
    opts.requirePassword && !(await pro.features.isSSOEnforced())
  if (!hashedPassword && requirePasswords) {
    throw "Password must be specified."
  }

  _id = _id || dbUtils.generateGlobalUserID()

  const fullUser = {
    createdAt: Date.now(),
    ...dbUser,
    ...user,
    _id,
    password: hashedPassword,
    tenantId,
  }
  // make sure the roles object is always present
  if (!fullUser.roles) {
    fullUser.roles = {}
  }
  // add the active status to a user if its not provided
  if (fullUser.status == null) {
    fullUser.status = UserStatus.ACTIVE
  }

  return fullUser
}

export async function invite(
  users: InviteUsersRequest
): Promise<InviteUsersResponse> {
  const response: InviteUsersResponse = {
    successful: [],
    unsuccessful: [],
  }

  const matchedEmails = await usersCore.searchExistingEmails(
    users.map(u => u.email)
  )
  const newUsers = []

  // separate duplicates from new users
  for (let user of users) {
    if (matchedEmails.includes(user.email)) {
      response.unsuccessful.push({ email: user.email, reason: "Unavailable" })
    } else {
      newUsers.push(user)
    }
  }
  // overwrite users with new only
  users = newUsers

  // send the emails for new users
  const tenantId = tenancy.getTenantId()
  for (let user of users) {
    try {
      let userInfo = user.userInfo
      if (!userInfo) {
        userInfo = {}
      }
      userInfo.tenantId = tenantId
      const opts: any = {
        subject: "{{ company }} platform invitation",
        info: userInfo,
      }
      await sendEmail(user.email, EmailTemplatePurpose.INVITATION, opts)
      response.successful.push({ email: user.email })
      await events.user.invited(user.email)
    } catch (e) {
      console.error(`Failed to send email invitation email=${user.email}`, e)
      response.unsuccessful.push({
        email: user.email,
        reason: "Failed to send email",
      })
    }
  }

  return response
}
