import env from "../environment"
import * as eventHelpers from "./events"
import * as accounts from "../accounts"
import * as accountSdk from "../accounts"
import * as cache from "../cache"
import { getGlobalDB, getIdentity, getTenantId } from "../context"
import * as dbUtils from "../db"
import { EmailUnavailableError, HTTPError } from "../errors"
import * as platform from "../platform"
import * as sessions from "../security/sessions"
import * as usersCore from "./users"
import {
  Account,
  AllDocsResponse,
  BulkUserCreated,
  BulkUserDeleted,
  isSSOAccount,
  isSSOUser,
  RowResponse,
  SaveUserOpts,
  User,
  UserStatus,
  UserGroup,
} from "@budibase/types"
import {
  getAccountHolderFromUserIds,
  isAdmin,
  isCreator,
  validateUniqueUser,
} from "./utils"
import { searchExistingEmails } from "./lookup"
import { hash } from "../utils"

type QuotaUpdateFn = (
  change: number,
  creatorsChange: number,
  cb?: () => Promise<any>
) => Promise<any>
type GroupUpdateFn = (groupId: string, userIds: string[]) => Promise<any>
type FeatureFn = () => Promise<Boolean>
type GroupGetFn = (ids: string[]) => Promise<UserGroup[]>
type GroupBuildersFn = (user: User) => Promise<string[]>
type QuotaFns = { addUsers: QuotaUpdateFn; removeUsers: QuotaUpdateFn }
type GroupFns = {
  addUsers: GroupUpdateFn
  getBulk: GroupGetFn
  getGroupBuilderAppIds: GroupBuildersFn
}
type FeatureFns = { isSSOEnforced: FeatureFn; isAppBuildersEnabled: FeatureFn }

const bulkDeleteProcessing = async (dbUser: User) => {
  const userId = dbUser._id as string
  await platform.users.removeUser(dbUser)
  await eventHelpers.handleDeleteEvents(dbUser)
  await cache.user.invalidateUser(userId)
  await sessions.invalidateSessions(userId, { reason: "bulk-deletion" })
}

export class UserDB {
  static quotas: QuotaFns
  static groups: GroupFns
  static features: FeatureFns

  static init(quotaFns: QuotaFns, groupFns: GroupFns, featureFns: FeatureFns) {
    UserDB.quotas = quotaFns
    UserDB.groups = groupFns
    UserDB.features = featureFns
  }

  static async isPreventPasswordActions(user: User, account?: Account) {
    // when in maintenance mode we allow sso users with the admin role
    // to perform any password action - this prevents lockout
    if (env.ENABLE_SSO_MAINTENANCE_MODE && isAdmin(user)) {
      return false
    }

    // SSO is enforced for all users
    if (await UserDB.features.isSSOEnforced()) {
      return true
    }

    // Check local sso
    if (isSSOUser(user)) {
      return true
    }

    // Check account sso
    if (!account) {
      account = await accountSdk.getAccountByTenantId(getTenantId())
    }
    return !!(account && account.email === user.email && isSSOAccount(account))
  }

  static async buildUser(
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
      if (await UserDB.isPreventPasswordActions(user, account)) {
        throw new HTTPError("Password change is disabled for this user", 400)
      }
      hashedPassword = opts.hashPassword ? await hash(password) : password
    } else if (dbUser) {
      hashedPassword = dbUser.password
    }

    // passwords are never required if sso is enforced
    const requirePasswords =
      opts.requirePassword && !(await UserDB.features.isSSOEnforced())
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
    // add the active status to a user if it's not provided
    if (fullUser.status == null) {
      fullUser.status = UserStatus.ACTIVE
    }

    return fullUser
  }

  static async allUsers() {
    const db = getGlobalDB()
    const response = await db.allDocs(
      dbUtils.getGlobalUserParams(null, {
        include_docs: true,
      })
    )
    return response.rows.map((row: any) => row.doc)
  }

  static async countUsersByApp(appId: string) {
    let response: any = await usersCore.searchGlobalUsersByApp(appId, {})
    return {
      userCount: response.length,
    }
  }

  static async getUsersByAppAccess(appId?: string) {
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

  static async getUserByEmail(email: string) {
    return usersCore.getGlobalUserByEmail(email)
  }

  /**
   * Gets a user by ID from the global database, based on the current tenancy.
   */
  static async getUser(userId: string) {
    const user = await usersCore.getById(userId)
    if (user) {
      delete user.password
    }
    return user
  }

  static async bulkGet(userIds: string[]) {
    return await usersCore.bulkGetGlobalUsersById(userIds)
  }

  static async bulkUpdate(users: User[]) {
    return await usersCore.bulkUpdateGlobalUsers(users)
  }

  static async save(user: User, opts: SaveUserOpts = {}): Promise<User> {
    // default booleans to true
    if (opts.hashPassword == null) {
      opts.hashPassword = true
    }
    if (opts.requirePassword == null) {
      opts.requirePassword = true
    }
    const tenantId = getTenantId()
    const db = getGlobalDB()

    let { email, _id, userGroups = [], roles } = user

    if (!email && !_id) {
      throw new Error("_id or email is required")
    }

    if (
      user.builder?.apps?.length &&
      !(await UserDB.features.isAppBuildersEnabled())
    ) {
      throw new Error("Unable to update app builders, please check license")
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
    const creatorsChange = isCreator(dbUser) !== isCreator(user) ? 1 : 0
    return UserDB.quotas.addUsers(change, creatorsChange, async () => {
      await validateUniqueUser(email, tenantId)

      let builtUser = await UserDB.buildUser(user, opts, tenantId, dbUser)
      // don't allow a user to update its own roles/perms
      if (opts.currentUserId && opts.currentUserId === dbUser?._id) {
        builtUser = usersCore.cleanseUserObject(builtUser, dbUser) as User
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
            groupPromises.push(UserDB.groups.addUsers(groupId, [_id!]))
          }
        }
      }

      try {
        // save the user to db
        let response = await db.put(builtUser)
        builtUser._rev = response.rev

        await eventHelpers.handleSaveEvents(builtUser, dbUser)
        await platform.users.addUser(
          tenantId,
          builtUser._id!,
          builtUser.email,
          builtUser.ssoId
        )
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

  static async bulkCreate(
    newUsersRequested: User[],
    groups: string[]
  ): Promise<BulkUserCreated> {
    const tenantId = getTenantId()

    let usersToSave: any[] = []
    let newUsers: any[] = []
    let newCreators: any[] = []

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
      if (isCreator(newUser)) {
        newCreators.push(newUser)
      }
    }

    const account = await accountSdk.getAccountByTenantId(tenantId)
    return UserDB.quotas.addUsers(
      newUsers.length,
      newCreators.length,
      async () => {
        // create the promises array that will be called by bulkDocs
        newUsers.forEach((user: any) => {
          usersToSave.push(
            UserDB.buildUser(
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
            groupPromises.push(UserDB.groups.addUsers(groupId, createdUserIds))
          }
          await Promise.all(groupPromises)
        }

        return {
          successful: saved,
          unsuccessful,
        }
      }
    )
  }

  static async bulkDelete(userIds: string[]): Promise<BulkUserDeleted> {
    const db = getGlobalDB()

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
    const creatorsToDelete = usersToDelete.filter(isCreator)

    for (let user of usersToDelete) {
      await bulkDeleteProcessing(user)
    }
    await UserDB.quotas.removeUsers(toDelete.length, creatorsToDelete.length)

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

  static async destroy(id: string) {
    const db = getGlobalDB()
    const dbUser = (await db.get(id)) as User
    const userId = dbUser._id as string

    if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
      // root account holder can't be deleted from inside budibase
      const email = dbUser.email
      const account = await accounts.getAccount(email)
      if (account) {
        if (dbUser.userId === getIdentity()!._id) {
          throw new HTTPError('Please visit "Account" to delete this user', 400)
        } else {
          throw new HTTPError("Account holder cannot be deleted", 400)
        }
      }
    }

    await platform.users.removeUser(dbUser)

    await db.remove(userId, dbUser._rev)

    const creatorsToDelete = isCreator(dbUser) ? 1 : 0
    await UserDB.quotas.removeUsers(1, creatorsToDelete)
    await eventHelpers.handleDeleteEvents(dbUser)
    await cache.user.invalidateUser(userId)
    await sessions.invalidateSessions(userId, { reason: "deletion" })
  }

  static async getGroups(groupIds: string[]) {
    return await this.groups.getBulk(groupIds)
  }

  static async getGroupBuilderAppIds(user: User) {
    return await this.groups.getGroupBuilderAppIds(user)
  }
}
