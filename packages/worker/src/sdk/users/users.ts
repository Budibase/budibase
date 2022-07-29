import env from "../../environment"
import { quotas } from "@budibase/pro"
import * as apps from "../../utilities/appService"
import * as eventHelpers from "./events"
import {
  tenancy,
  utils,
  db as dbUtils,
  constants,
  cache,
  users as usersCore,
  deprovisioning,
  sessions,
  HTTPError,
  accounts,
  migrations,
} from "@budibase/backend-core"
import { MigrationType, User } from "@budibase/types"
import { groups as groupUtils } from "@budibase/pro"

const PAGE_LIMIT = 8

export const allUsers = async (newDb?: any) => {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs(
    dbUtils.getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const paginatedUsers = async ({
  page,
  email,
  appId,
}: { page?: string; email?: string; appId?: string } = {}) => {
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
  let user
  try {
    user = await db.get(userId)
  } catch (err: any) {
    // no user found, just return nothing
    if (err.status === 404) {
      return {}
    }
    throw err
  }
  if (user) {
    delete user.password
  }
  return user
}

interface SaveUserOpts {
  hashPassword?: boolean
  requirePassword?: boolean
  bulkCreate?: boolean
}

export const buildUser = async (
  user: any,
  opts: SaveUserOpts = {
    hashPassword: true,
    requirePassword: true,
    bulkCreate: false,
  },
  tenantId: string,
  dbUser?: any
) => {
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

export const save = async (
  user: any,
  opts: SaveUserOpts = {
    hashPassword: true,
    requirePassword: true,
    bulkCreate: false,
  }
) => {
  const tenantId = tenancy.getTenantId()
  const db = tenancy.getGlobalDB()
  let { email, _id } = user
  // make sure another user isn't using the same email
  let dbUser: any
  if (opts.bulkCreate) {
    dbUser = null
  } else if (email) {
    // check budibase users inside the tenant
    dbUser = await usersCore.getGlobalUserByEmail(email)
    if (dbUser != null && (dbUser._id !== _id || Array.isArray(dbUser))) {
      throw `Email address ${email} already in use.`
    }

    // check budibase users in other tenants
    if (env.MULTI_TENANCY) {
      const tenantUser = await tenancy.getTenantUser(email)
      if (tenantUser != null && tenantUser.tenantId !== tenantId) {
        throw `Email address ${email} already in use.`
      }
    }

    // check root account users in account portal
    if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
      const account = await accounts.getAccount(email)
      if (account && account.verified && account.tenantId !== tenantId) {
        throw `Email address ${email} already in use.`
      }
    }
  } else if (_id) {
    dbUser = await db.get(_id)
  }

  let builtUser = await buildUser(
    user,
    {
      hashPassword: true,
      requirePassword: user.requirePassword,
    },
    tenantId,
    dbUser
  )

  try {
    const putOpts = {
      password: builtUser.password,
      ...user,
    }
    if (opts.bulkCreate) {
      return putOpts
    }
    // save the user to db
    let response
    const putUserFn = () => {
      return db.put(builtUser)
    }

    if (eventHelpers.isAddingBuilder(builtUser, dbUser)) {
      response = await quotas.addDeveloper(putUserFn)
    } else {
      response = await putUserFn()
    }
    builtUser._rev = response.rev

    await eventHelpers.handleSaveEvents(builtUser, dbUser)
    await addTenant(tenantId, _id, email)
    await cache.user.invalidateUser(response.id)
    // let server know to sync user
    await apps.syncUserInApps(builtUser._id)

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

export const bulkCreate = async (
  newUsersRequested: User[],
  groups: string[]
) => {
  const db = tenancy.getGlobalDB()
  const tenantId = tenancy.getTenantId()

  let usersToSave: any[] = []
  let newUsers: any[] = []

  const allUsers = await db.allDocs(
    dbUtils.getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  let mapped = allUsers.rows.map((row: any) => row.id)

  const currentUserEmails = mapped.map((x: any) => x.email) || []
  for (const newUser of newUsersRequested) {
    if (
      newUsers.find((x: any) => x.email === newUser.email) ||
      currentUserEmails.includes(newUser.email)
    ) {
      continue
    }
    newUser.userGroups = groups
    newUsers.push(newUser)
  }

  // Figure out how many builders we are adding and create the promises
  // array that will be called by bulkDocs
  let builderCount = 0
  newUsers.forEach((user: any) => {
    if (eventHelpers.isAddingBuilder(user, null)) {
      builderCount++
    }
    usersToSave.push(
      buildUser(
        user,
        {
          hashPassword: true,
          requirePassword: user.requirePassword,
          bulkCreate: false,
        },
        tenantId
      )
    )
  })

  const usersToBulkSave = await Promise.all(usersToSave)
  await quotas.addDevelopers(() => db.bulkDocs(usersToBulkSave), builderCount)

  // Post processing of bulk added users, i.e events and cache operations
  for (const user of usersToBulkSave) {
    await eventHelpers.handleSaveEvents(user, null)
    await apps.syncUserInApps(user._id)
  }

  return usersToBulkSave.map(user => {
    return {
      _id: user._id,
      email: user.email,
    }
  })
}

export const bulkDelete = async (userIds: any) => {
  const db = tenancy.getGlobalDB()

  let groupsToModify: any = {}
  let builderCount = 0
  // Get users and delete
  let usersToDelete = (
    await db.allDocs({
      include_docs: true,
      keys: userIds,
    })
  ).rows.map((user: any) => {
    // if we find a user that has an associated group, add it to
    // an array so we can easily use allDocs on them later.
    // This prevents us having to re-loop over all the users
    if (user.doc.userGroups) {
      for (let groupId of user.doc.userGroups) {
        if (!Object.keys(groupsToModify).includes(groupId)) {
          groupsToModify[groupId] = [user.id]
        } else {
          groupsToModify[groupId] = [...groupsToModify[groupId], user.id]
        }
      }
    }

    // Also figure out how many builders are being deleted
    if (eventHelpers.isAddingBuilder(user.doc, null)) {
      builderCount++
    }

    return user.doc
  })

  const response = await db.bulkDocs(
    usersToDelete.map((user: any) => ({
      ...user,
      _deleted: true,
    }))
  )

  await groupUtils.bulkDeleteGroupUsers(groupsToModify)

  //Deletion post processing
  for (let user of usersToDelete) {
    await bulkDeleteProcessing(user)
  }

  await quotas.removeDevelopers(builderCount)

  return response
}

export const destroy = async (id: string, currentUser: any) => {
  const db = tenancy.getGlobalDB()
  const dbUser = await db.get(id)
  let groups = dbUser.userGroups

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

  await db.remove(dbUser._id, dbUser._rev)

  if (groups) {
    await groupUtils.deleteGroupUsers(groups, dbUser)
  }

  await eventHelpers.handleDeleteEvents(dbUser)
  await quotas.removeUser(dbUser)
  await cache.user.invalidateUser(dbUser._id)
  await sessions.invalidateSessions(dbUser._id)
  // let server know to sync user
  await apps.syncUserInApps(dbUser._id)
}

const bulkDeleteProcessing = async (dbUser: User) => {
  await deprovisioning.removeUserFromInfoDB(dbUser)
  await eventHelpers.handleDeleteEvents(dbUser)
  await cache.user.invalidateUser(dbUser._id)
  await sessions.invalidateSessions(dbUser._id)
  // let server know to sync user
  await apps.syncUserInApps(dbUser._id)
}
