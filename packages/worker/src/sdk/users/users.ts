import env from "../../environment"
import * as apps from "../../utilities/appService"
import * as eventHelpers from "./events"
import {
  accounts,
  cache,
  constants,
  db as dbUtils,
  deprovisioning,
  events,
  HTTPError,
  migrations,
  sessions,
  tenancy,
  users as usersCore,
  utils,
  ViewName,
} from "@budibase/backend-core"
import {
  AccountMetadata,
  AllDocsResponse,
  BulkUserResponse,
  CloudAccount,
  CreateUserResponse,
  InviteUsersRequest,
  InviteUsersResponse,
  MigrationType,
  PlatformUserByEmail,
  RowResponse,
  SearchUsersRequest,
  User,
} from "@budibase/types"
import { sendEmail } from "../../utilities/email"
import { EmailTemplatePurpose } from "../../constants"
import { groups as groupsSdk } from "@budibase/pro"

const PAGE_LIMIT = 8

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

export const paginatedUsers = async ({
  page,
  email,
  appId,
  userIds,
}: SearchUsersRequest = {}) => {
  const db = tenancy.getGlobalDB()
  // get one extra document, to have the next page
  const opts: any = {
    include_docs: true,
    limit: PAGE_LIMIT + 1,
  }
  // add a startkey if the page was specified (anchor)
  if (page) {
    opts.startkey = page
  }
  // property specifies what to use for the page/anchor
  let userList,
    property = "_id",
    getKey
  if (appId) {
    userList = await usersCore.searchGlobalUsersByApp(appId, opts)
    getKey = (doc: any) => usersCore.getGlobalUserByAppPage(appId, doc)
  } else if (email) {
    userList = await usersCore.searchGlobalUsersByEmail(email, opts)
    property = "email"
  } else {
    // no search, query allDocs
    const response = await db.allDocs(dbUtils.getGlobalUserParams(null, opts))
    userList = response.rows.map((row: any) => row.doc)
  }
  return dbUtils.pagination(userList, PAGE_LIMIT, {
    paginate: true,
    property,
    getKey,
  })
}

/**
 * Gets a user by ID from the global database, based on the current tenancy.
 */
export const getUser = async (userId: string) => {
  const db = tenancy.getGlobalDB()
  let user = await db.get(userId)
  if (user) {
    delete user.password
  }
  return user
}

interface SaveUserOpts {
  hashPassword?: boolean
  requirePassword?: boolean
}

const buildUser = async (
  user: User,
  opts: SaveUserOpts = {
    hashPassword: true,
    requirePassword: true,
  },
  tenantId: string,
  dbUser?: any
): Promise<User> => {
  let { password, _id } = user

  let hashedPassword
  if (password) {
    hashedPassword = opts.hashPassword ? await utils.hash(password) : password
  } else if (dbUser) {
    hashedPassword = dbUser.password
  } else if (opts.requirePassword) {
    throw "Password must be specified."
  }

  _id = _id || dbUtils.generateGlobalUserID()

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
    user.status = constants.UserStatus.ACTIVE
  }

  return user
}

const validateUniqueUser = async (email: string, tenantId: string) => {
  // check budibase users in other tenants
  if (env.MULTI_TENANCY) {
    const tenantUser = await tenancy.getTenantUser(email)
    if (tenantUser != null && tenantUser.tenantId !== tenantId) {
      throw `Unavailable`
    }
  }

  // check root account users in account portal
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const account = await accounts.getAccount(email)
    if (account && account.verified && account.tenantId !== tenantId) {
      throw `Unavailable`
    }
  }
}

export const save = async (
  user: User,
  opts: SaveUserOpts = {
    hashPassword: true,
    requirePassword: true,
  }
): Promise<CreateUserResponse> => {
  const tenantId = tenancy.getTenantId()
  const db = tenancy.getGlobalDB()
  let { email, _id } = user
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
      throw `Unavailable`
    }
  }

  await validateUniqueUser(email, tenantId)

  let builtUser = await buildUser(user, opts, tenantId, dbUser)

  // make sure we set the _id field for a new user
  if (!_id) {
    _id = builtUser._id!
  }

  try {
    // save the user to db
    let response = await db.put(builtUser)
    builtUser._rev = response.rev

    await eventHelpers.handleSaveEvents(builtUser, dbUser)
    await addTenant(tenantId, _id, email)
    await cache.user.invalidateUser(response.id)
    // let server know to sync user
    await apps.syncUserInApps(_id)

    return {
      _id: response.id,
      _rev: response.rev,
      email,
    }
  } catch (err: any) {
    if (err.status === 409) {
      throw "User exists already"
    } else {
      throw err
    }
  }
}

export const addTenant = async (
  tenantId: string,
  _id: string,
  email: string
) => {
  if (env.MULTI_TENANCY) {
    const afterCreateTenant = () =>
      migrations.backPopulateMigrations({
        type: MigrationType.GLOBAL,
        tenantId,
      })
    await tenancy.tryAddTenant(tenantId, _id, email, afterCreateTenant)
  }
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
): Promise<BulkUserResponse["created"]> => {
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

  // create the promises array that will be called by bulkDocs
  newUsers.forEach((user: any) => {
    usersToSave.push(
      buildUser(
        user,
        {
          hashPassword: true,
          requirePassword: user.requirePassword,
        },
        tenantId
      )
    )
  })

  const usersToBulkSave = await Promise.all(usersToSave)
  await usersCore.bulkUpdateGlobalUsers(usersToBulkSave)

  // Post-processing of bulk added users, e.g. events and cache operations
  for (const user of usersToBulkSave) {
    // TODO: Refactor to bulk insert users into the info db
    // instead of relying on looping tenant creation
    await addTenant(tenantId, user._id, user.email)
    await eventHelpers.handleSaveEvents(user, undefined)
    await apps.syncUserInApps(user._id)
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
      groupPromises.push(groupsSdk.addUsers(groupId, createdUserIds))
    }
    await Promise.all(groupPromises)
  }

  return {
    successful: saved,
    unsuccessful,
  }
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
): Promise<BulkUserResponse["deleted"]> => {
  const db = tenancy.getGlobalDB()

  const response: BulkUserResponse["deleted"] = {
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

export const destroy = async (id: string, currentUser: any) => {
  const db = tenancy.getGlobalDB()
  const dbUser = await db.get(id)
  const userId = dbUser._id as string

  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    // root account holder can't be deleted from inside budibase
    const email = dbUser.email
    const account = await accounts.getAccount(email)
    if (account) {
      if (email === currentUser.email) {
        throw new HTTPError('Please visit "Account" to delete this user', 400)
      } else {
        throw new HTTPError("Account holder cannot be deleted", 400)
      }
    }
  }

  await deprovisioning.removeUserFromInfoDB(dbUser)

  await db.remove(userId, dbUser._rev)

  await eventHelpers.handleDeleteEvents(dbUser)
  await cache.user.invalidateUser(userId)
  await sessions.invalidateSessions(userId, { reason: "deletion" })
  // let server know to sync user
  await apps.syncUserInApps(userId)
}

const bulkDeleteProcessing = async (dbUser: User) => {
  const userId = dbUser._id as string
  await deprovisioning.removeUserFromInfoDB(dbUser)
  await eventHelpers.handleDeleteEvents(dbUser)
  await cache.user.invalidateUser(userId)
  await sessions.invalidateSessions(userId, { reason: "bulk-deletion" })
  // let server know to sync user
  await apps.syncUserInApps(userId)
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
      await events.user.invited()
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
