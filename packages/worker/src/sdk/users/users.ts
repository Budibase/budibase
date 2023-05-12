import env from "../../environment"
import * as eventHelpers from "./events"
import {
  accounts,
  cache,
  constants,
  db as dbUtils,
  events,
  HTTPError,
  sessions,
  tenancy,
  platform,
  users as usersCore,
  utils,
  ViewName,
  env as coreEnv,
  context,
  EmailUnavailableError,
} from "@budibase/backend-core"
import {
  AccountMetadata,
  AllDocsResponse,
  CloudAccount,
  InviteUsersRequest,
  InviteUsersResponse,
  isSSOAccount,
  isSSOUser,
  PlatformUser,
  PlatformUserByEmail,
  RowResponse,
  User,
  SaveUserOpts,
  BulkUserCreated,
  BulkUserDeleted,
  Account,
} from "@budibase/types"
import { sendEmail } from "../../utilities/email"
import { EmailTemplatePurpose } from "../../constants"
import * as pro from "@budibase/pro"
import * as accountSdk from "../accounts"

export const allUsers = async () => {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs(
    dbUtils.getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const countUsersByApp = async (appId: string) => {
  let response: any = await usersCore.searchGlobalUsersByApp(appId, {})
  return {
    userCount: response.length,
  }
}

export const getUsersByAppAccess = async (appId?: string) => {
  const opts: any = {
    include_docs: true,
    limit: 50,
  }
  let response: User[] = await usersCore.searchGlobalUsersByAppAccess(
    appId,
    opts
  )
  return response
}

export async function getUserByEmail(email: string) {
  return usersCore.getGlobalUserByEmail(email)
}

/**
 * Gets a user by ID from the global database, based on the current tenancy.
 */
export const getUser = async (userId: string) => {
  const user = await usersCore.getById(userId)
  if (user) {
    delete user.password
  }
  return user
}

const buildUser = async (
  user: User,
  opts: SaveUserOpts = {
    hashPassword: true,
    requirePassword: true,
  },
  tenantId: string,
  dbUser?: any,
  account?: Account
): Promise<User> => {
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
    fullUser.status = constants.UserStatus.ACTIVE
  }

  return fullUser
}

// lookup, could be email or userId, either will return a doc
export const getPlatformUser = async (
  identifier: string
): Promise<PlatformUser | null> => {
  // use the view here and allow to find anyone regardless of casing
  // Use lowercase to ensure email login is case insensitive
  const response = dbUtils.queryPlatformView(
    ViewName.PLATFORM_USERS_LOWERCASE,
    {
      keys: [identifier.toLowerCase()],
      include_docs: true,
    }
  ) as Promise<PlatformUser>
  return response
}

const validateUniqueUser = async (email: string, tenantId: string) => {
  // check budibase users in other tenants
  if (env.MULTI_TENANCY) {
    const tenantUser = await getPlatformUser(email)
    if (tenantUser != null && tenantUser.tenantId !== tenantId) {
      throw new EmailUnavailableError(email)
    }
  }

  // check root account users in account portal
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const account = await accounts.getAccount(email)
    if (account && account.verified && account.tenantId !== tenantId) {
      throw new EmailUnavailableError(email)
    }
  }
}

export async function isPreventPasswordActions(user: User, account?: Account) {
  // when in maintenance mode we allow sso users with the admin role
  // to perform any password action - this prevents lockout
  if (coreEnv.ENABLE_SSO_MAINTENANCE_MODE && user.admin?.global) {
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
    account = await accountSdk.api.getAccountByTenantId(tenancy.getTenantId())
  }
  return !!(account && account.email === user.email && isSSOAccount(account))
}

// TODO: The single save should re-use the bulk insert with a single
// user so that we don't need to duplicate logic
export const save = async (
  user: User,
  opts: SaveUserOpts = {}
): Promise<User> => {
  // default booleans to true
  if (opts.hashPassword == null) {
    opts.hashPassword = true
  }
  if (opts.requirePassword == null) {
    opts.requirePassword = true
  }
  const tenantId = tenancy.getTenantId()
  const db = tenancy.getGlobalDB()

  let { email, _id, userGroups = [], roles } = user

  if (!email && !_id) {
    throw new Error("_id or email is required")
  }

  let dbUser: User | undefined
  if (_id) {
    // try to get existing user from db
    try {
      dbUser = (await db.get(_id)) as User
      if (email && dbUser.email !== email) {
        throw "Email address cannot be changed"
      }
      email = dbUser.email
    } catch (e: any) {
      if (e.status === 404) {
        // do nothing, save this new user with the id specified - required for SSO auth
      } else {
        throw e
      }
    }
  }

  if (!dbUser && email) {
    // no id was specified - load from email instead
    dbUser = await usersCore.getGlobalUserByEmail(email)
    if (dbUser && dbUser._id !== _id) {
      throw new EmailUnavailableError(email)
    }
  }

  const change = dbUser ? 0 : 1 // no change if there is existing user
  return pro.quotas.addUsers(change, async () => {
    await validateUniqueUser(email, tenantId)

    let builtUser = await buildUser(user, opts, tenantId, dbUser)
    // don't allow a user to update its own roles/perms
    if (opts.currentUserId && opts.currentUserId === dbUser?._id) {
      builtUser.builder = dbUser.builder
      builtUser.admin = dbUser.admin
      builtUser.roles = dbUser.roles
    }

    if (!dbUser && roles?.length) {
      builtUser.roles = { ...roles }
    }

    // make sure we set the _id field for a new user
    // Also if this is a new user, associate groups with them
    let groupPromises = []
    if (!_id) {
      _id = builtUser._id!

      if (userGroups.length > 0) {
        for (let groupId of userGroups) {
          groupPromises.push(pro.groups.addUsers(groupId, [_id]))
        }
      }
    }

    try {
      // save the user to db
      let response = await db.put(builtUser)
      builtUser._rev = response.rev

      await eventHelpers.handleSaveEvents(builtUser, dbUser)
      await platform.users.addUser(tenantId, builtUser._id!, builtUser.email)
      await cache.user.invalidateUser(response.id)

      await Promise.all(groupPromises)

      // finally returned the saved user from the db
      return db.get(builtUser._id!)
    } catch (err: any) {
      if (err.status === 409) {
        throw "User exists already"
      } else {
        throw err
      }
    }
  })
}

const getExistingTenantUsers = async (emails: string[]): Promise<User[]> => {
  const lcEmails = emails.map(email => email.toLowerCase())
  const params = {
    keys: lcEmails,
    include_docs: true,
  }

  const opts = {
    arrayResponse: true,
  }

  return dbUtils.queryGlobalView(
    ViewName.USER_BY_EMAIL,
    params,
    undefined,
    opts
  ) as Promise<User[]>
}

const getExistingPlatformUsers = async (
  emails: string[]
): Promise<PlatformUserByEmail[]> => {
  const lcEmails = emails.map(email => email.toLowerCase())
  const params = {
    keys: lcEmails,
    include_docs: true,
  }

  const opts = {
    arrayResponse: true,
  }
  return dbUtils.queryPlatformView(
    ViewName.PLATFORM_USERS_LOWERCASE,
    params,
    opts
  ) as Promise<PlatformUserByEmail[]>
}

const getExistingAccounts = async (
  emails: string[]
): Promise<AccountMetadata[]> => {
  const lcEmails = emails.map(email => email.toLowerCase())
  const params = {
    keys: lcEmails,
    include_docs: true,
  }

  const opts = {
    arrayResponse: true,
  }

  return dbUtils.queryPlatformView(
    ViewName.ACCOUNT_BY_EMAIL,
    params,
    opts
  ) as Promise<AccountMetadata[]>
}

/**
 * Apply a system-wide search on emails:
 * - in tenant
 * - cross tenant
 * - accounts
 * return an array of emails that match the supplied emails.
 */
const searchExistingEmails = async (emails: string[]) => {
  let matchedEmails: string[] = []

  const existingTenantUsers = await getExistingTenantUsers(emails)
  matchedEmails.push(...existingTenantUsers.map(user => user.email))

  const existingPlatformUsers = await getExistingPlatformUsers(emails)
  matchedEmails.push(...existingPlatformUsers.map(user => user._id!))

  const existingAccounts = await getExistingAccounts(emails)
  matchedEmails.push(...existingAccounts.map(account => account.email))

  return [...new Set(matchedEmails.map(email => email.toLowerCase()))]
}

export const bulkCreate = async (
  newUsersRequested: User[],
  groups: string[]
): Promise<BulkUserCreated> => {
  const tenantId = tenancy.getTenantId()

  let usersToSave: any[] = []
  let newUsers: any[] = []

  const emails = newUsersRequested.map((user: User) => user.email)
  const existingEmails = await searchExistingEmails(emails)
  const unsuccessful: { email: string; reason: string }[] = []

  for (const newUser of newUsersRequested) {
    if (
      newUsers.find(
        (x: User) => x.email.toLowerCase() === newUser.email.toLowerCase()
      ) ||
      existingEmails.includes(newUser.email.toLowerCase())
    ) {
      unsuccessful.push({
        email: newUser.email,
        reason: `Unavailable`,
      })
      continue
    }
    newUser.userGroups = groups
    newUsers.push(newUser)
  }

  const account = await accountSdk.api.getAccountByTenantId(tenantId)
  return pro.quotas.addUsers(newUsers.length, async () => {
    // create the promises array that will be called by bulkDocs
    newUsers.forEach((user: any) => {
      usersToSave.push(
        buildUser(
          user,
          {
            hashPassword: true,
            requirePassword: user.requirePassword,
          },
          tenantId,
          undefined, // no dbUser
          account
        )
      )
    })

    const usersToBulkSave = await Promise.all(usersToSave)
    await usersCore.bulkUpdateGlobalUsers(usersToBulkSave)

    // Post-processing of bulk added users, e.g. events and cache operations
    for (const user of usersToBulkSave) {
      // TODO: Refactor to bulk insert users into the info db
      // instead of relying on looping tenant creation
      await platform.users.addUser(tenantId, user._id, user.email)
      await eventHelpers.handleSaveEvents(user, undefined)
    }

    const saved = usersToBulkSave.map(user => {
      return {
        _id: user._id,
        email: user.email,
      }
    })

    // now update the groups
    if (Array.isArray(saved) && groups) {
      const groupPromises = []
      const createdUserIds = saved.map(user => user._id)
      for (let groupId of groups) {
        groupPromises.push(pro.groups.addUsers(groupId, createdUserIds))
      }
      await Promise.all(groupPromises)
    }

    return {
      successful: saved,
      unsuccessful,
    }
  })
}

/**
 * For the given user id's, return the account holder if it is in the ids.
 */
const getAccountHolderFromUserIds = async (
  userIds: string[]
): Promise<CloudAccount | undefined> => {
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const tenantId = tenancy.getTenantId()
    const account = await accounts.getAccountByTenantId(tenantId)
    if (!account) {
      throw new Error(`Account not found for tenantId=${tenantId}`)
    }

    const budibaseUserId = account.budibaseUserId
    if (userIds.includes(budibaseUserId)) {
      return account
    }
  }
}

export const bulkDelete = async (
  userIds: string[]
): Promise<BulkUserDeleted> => {
  const db = tenancy.getGlobalDB()

  const response: BulkUserDeleted = {
    successful: [],
    unsuccessful: [],
  }

  // remove the account holder from the delete request if present
  const account = await getAccountHolderFromUserIds(userIds)
  if (account) {
    userIds = userIds.filter(u => u !== account.budibaseUserId)
    // mark user as unsuccessful
    response.unsuccessful.push({
      _id: account.budibaseUserId,
      email: account.email,
      reason: "Account holder cannot be deleted",
    })
  }

  // Get users and delete
  const allDocsResponse: AllDocsResponse<User> = await db.allDocs({
    include_docs: true,
    keys: userIds,
  })
  const usersToDelete: User[] = allDocsResponse.rows.map(
    (user: RowResponse<User>) => {
      return user.doc
    }
  )

  // Delete from DB
  const toDelete = usersToDelete.map(user => ({
    ...user,
    _deleted: true,
  }))
  const dbResponse = await usersCore.bulkUpdateGlobalUsers(toDelete)

  await pro.quotas.removeUsers(toDelete.length)
  for (let user of usersToDelete) {
    await bulkDeleteProcessing(user)
  }

  // Build Response
  // index users by id
  const userIndex: { [key: string]: User } = {}
  usersToDelete.reduce((prev, current) => {
    prev[current._id!] = current
    return prev
  }, userIndex)

  // add the successful and unsuccessful users to response
  dbResponse.forEach(item => {
    const email = userIndex[item.id].email
    if (item.ok) {
      response.successful.push({ _id: item.id, email })
    } else {
      response.unsuccessful.push({
        _id: item.id,
        email,
        reason: "Database error",
      })
    }
  })

  return response
}

// TODO: The single delete should re-use the bulk delete with a single
// user so that we don't need to duplicate logic
export const destroy = async (id: string) => {
  const db = tenancy.getGlobalDB()
  const dbUser = (await db.get(id)) as User
  const userId = dbUser._id as string

  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    // root account holder can't be deleted from inside budibase
    const email = dbUser.email
    const account = await accounts.getAccount(email)
    if (account) {
      if (dbUser.userId === context.getIdentity()!._id) {
        throw new HTTPError('Please visit "Account" to delete this user', 400)
      } else {
        throw new HTTPError("Account holder cannot be deleted", 400)
      }
    }
  }

  await platform.users.removeUser(dbUser)

  await db.remove(userId, dbUser._rev)

  await pro.quotas.removeUsers(1)
  await eventHelpers.handleDeleteEvents(dbUser)
  await cache.user.invalidateUser(userId)
  await sessions.invalidateSessions(userId, { reason: "deletion" })
}

const bulkDeleteProcessing = async (dbUser: User) => {
  const userId = dbUser._id as string
  await platform.users.removeUser(dbUser)
  await eventHelpers.handleDeleteEvents(dbUser)
  await cache.user.invalidateUser(userId)
  await sessions.invalidateSessions(userId, { reason: "bulk-deletion" })
}

export const invite = async (
  users: InviteUsersRequest
): Promise<InviteUsersResponse> => {
  const response: InviteUsersResponse = {
    successful: [],
    unsuccessful: [],
  }

  const matchedEmails = await searchExistingEmails(users.map(u => u.email))
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
