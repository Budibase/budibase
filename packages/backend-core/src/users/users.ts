import {
  directCouchFind,
  DocumentType,
  generateAppUserID,
  getGlobalUserParams,
  getProdAppID,
  getUsersByAppParams,
  pagination,
  queryGlobalView,
  queryGlobalViewRaw,
  SEPARATOR,
  UNICODE_MAX,
  ViewName,
} from "../db"
import {
  BulkDocsResponse,
  ContextUser,
  CouchFindOptions,
  DatabaseQueryOpts,
  SearchUsersRequest,
  User,
} from "@budibase/types"
import * as context from "../context"
import { getGlobalDB } from "../context"
import { isCreator } from "./utils"
import { UserDB } from "./db"
import { dataFilters } from "@budibase/shared-core"

type GetOpts = { cleanup?: boolean }

function removeUserPassword(users: User | User[]) {
  if (Array.isArray(users)) {
    return users.map(user => {
      if (user) {
        delete user.password
        return user
      }
    })
  } else if (users) {
    delete users.password
    return users
  }
  return users
}

export async function bulkGetGlobalUsersById(
  userIds: string[],
  opts?: GetOpts
) {
  const db = getGlobalDB()
  let users = (
    await db.allDocs({
      keys: userIds,
      include_docs: true,
    })
  ).rows.map(row => row.doc) as User[]
  if (opts?.cleanup) {
    users = removeUserPassword(users) as User[]
  }
  return users
}

export async function getAllUserIds() {
  const db = getGlobalDB()
  const startKey = `${DocumentType.USER}${SEPARATOR}`
  const response = await db.allDocs({
    startkey: startKey,
    endkey: `${startKey}${UNICODE_MAX}`,
  })
  return response.rows.map(row => row.id)
}

export async function getAllUsers(): Promise<User[]> {
  const db = getGlobalDB()
  const startKey = `${DocumentType.USER}${SEPARATOR}`
  const response = await db.allDocs({
    startkey: startKey,
    endkey: `${startKey}${UNICODE_MAX}`,
    include_docs: true,
  })
  return response.rows.map(row => row.doc) as User[]
}

export async function bulkUpdateGlobalUsers(users: User[]) {
  const db = getGlobalDB()
  return (await db.bulkDocs(users)) as BulkDocsResponse
}

export async function getById(id: string, opts?: GetOpts): Promise<User> {
  const db = context.getGlobalDB()
  let user = await db.get<User>(id)
  if (opts?.cleanup) {
    user = removeUserPassword(user) as User
  }
  return user
}

/**
 * Given an email address this will use a view to search through
 * all the users to find one with this email address.
 */
export async function getGlobalUserByEmail(
  email: String,
  opts?: GetOpts
): Promise<User | undefined> {
  if (email == null) {
    throw "Must supply an email address to view"
  }

  const response = await queryGlobalView<User>(ViewName.USER_BY_EMAIL, {
    key: email.toLowerCase(),
    include_docs: true,
  })

  if (Array.isArray(response)) {
    // shouldn't be able to happen, but need to handle just in case
    throw new Error(`Multiple users found with email address: ${email}`)
  }

  let user = response as User
  if (opts?.cleanup) {
    user = removeUserPassword(user) as User
  }

  return user
}

export async function doesUserExist(email: string) {
  try {
    const user = await getGlobalUserByEmail(email)
    if (Array.isArray(user) || user != null) {
      return true
    }
  } catch (err) {
    return false
  }
  return false
}

export async function searchGlobalUsersByApp(
  appId: any,
  opts: DatabaseQueryOpts,
  getOpts?: GetOpts
) {
  if (typeof appId !== "string") {
    throw new Error("Must provide a string based app ID")
  }
  const params = getUsersByAppParams(appId, {
    include_docs: true,
  })
  params.startkey = opts && opts.startkey ? opts.startkey : params.startkey
  let response = await queryGlobalView<User>(ViewName.USER_BY_APP, params)

  if (!response) {
    response = []
  }
  let users: User[] = Array.isArray(response) ? response : [response]
  if (getOpts?.cleanup) {
    users = removeUserPassword(users) as User[]
  }
  return users
}

/*
  Return any user who potentially has access to the application
  Admins, developers and app users with the explicitly role.
*/
export async function searchGlobalUsersByAppAccess(
  appId: any,
  opts?: { limit?: number }
) {
  const roleSelector = `roles.${appId}`

  let orQuery: any[] = [
    {
      "builder.global": true,
    },
    {
      "admin.global": true,
    },
  ]

  if (appId) {
    const roleCheck = {
      [roleSelector]: {
        $exists: true,
      },
    }
    orQuery.push(roleCheck)
  }

  let searchOptions: CouchFindOptions = {
    selector: {
      $or: orQuery,
      _id: {
        $regex: "^us_",
      },
    },
    limit: opts?.limit || 50,
  }

  const resp = await directCouchFind(context.getGlobalDBName(), searchOptions)
  return resp.rows
}

export function getGlobalUserByAppPage(appId: string, user: User) {
  if (!user) {
    return
  }
  return generateAppUserID(getProdAppID(appId)!, user._id!)
}

/**
 * Performs a starts with search on the global email view.
 */
export async function searchGlobalUsersByEmail(
  email: string | unknown,
  opts: any,
  getOpts?: GetOpts
) {
  if (typeof email !== "string") {
    throw new Error("Must provide a string to search by")
  }
  const lcEmail = email.toLowerCase()
  // handle if passing up startkey for pagination
  const startkey = opts && opts.startkey ? opts.startkey : lcEmail
  let response = await queryGlobalView<User>(ViewName.USER_BY_EMAIL, {
    ...opts,
    startkey,
    endkey: `${lcEmail}${UNICODE_MAX}`,
  })
  if (!response) {
    response = []
  }
  let users: User[] = Array.isArray(response) ? response : [response]
  if (getOpts?.cleanup) {
    users = removeUserPassword(users) as User[]
  }
  return users
}

const PAGE_LIMIT = 8
export async function paginatedUsers({
  bookmark,
  query,
  appId,
  limit,
}: SearchUsersRequest = {}) {
  const db = getGlobalDB()
  const pageSize = limit ?? PAGE_LIMIT
  const pageLimit = pageSize + 1
  // get one extra document, to have the next page
  const opts: DatabaseQueryOpts = {
    include_docs: true,
    limit: pageLimit,
  }
  // add a startkey if the page was specified (anchor)
  if (bookmark) {
    opts.startkey = bookmark
  }
  // property specifies what to use for the page/anchor
  let userList: User[],
    property = "_id",
    getKey
  if (query?.equal?._id) {
    userList = [await getById(query.equal._id)]
  } else if (appId) {
    userList = await searchGlobalUsersByApp(appId, opts)
    getKey = (doc: any) => getGlobalUserByAppPage(appId, doc)
  } else if (query?.string?.email) {
    userList = await searchGlobalUsersByEmail(query?.string?.email, opts)
    property = "email"
  } else if (query?.oneOf?._id) {
    userList = await bulkGetGlobalUsersById(query?.oneOf?._id, {
      cleanup: true,
    })
  } else if (query) {
    // TODO: this should use SQS search, but the logic is built in the 'server' package. Using the in-memory filtering to get this working meanwhile
    const response = await db.allDocs<User>(
      getGlobalUserParams(null, { ...opts, limit: undefined })
    )
    userList = response.rows.map(row => row.doc!)
    userList = dataFilters.search(userList, { query, limit: opts.limit }).rows
  } else {
    // no search, query allDocs
    const response = await db.allDocs<User>(getGlobalUserParams(null, opts))
    userList = response.rows.map(row => row.doc!)
  }
  return pagination(userList, pageSize, {
    paginate: true,
    property,
    getKey,
  })
}

export async function getUserCount() {
  const response = await queryGlobalViewRaw(ViewName.USER_BY_EMAIL, {
    limit: 0, // to be as fast as possible - we just want the total rows count
    include_docs: false,
  })
  return response.total_rows
}

export async function getCreatorCount() {
  let creators = 0
  async function iterate(startPage?: string) {
    const page = await paginatedUsers({ bookmark: startPage })
    const creatorsEval = await Promise.all(page.data.map(isCreator))
    creators += creatorsEval.filter(creator => !!creator).length
    if (page.hasNextPage) {
      await iterate(page.nextPage)
    }
  }
  await iterate()
  return creators
}

// used to remove the builder/admin permissions, for processing the
// user as an app user (they may have some specific role/group
export function removePortalUserPermissions(user: User | ContextUser) {
  delete user.admin
  delete user.builder
  return user
}

export function cleanseUserObject(user: User | ContextUser, base?: User) {
  delete user.admin
  delete user.builder
  delete user.roles
  if (base) {
    user.admin = base.admin
    user.builder = base.builder
    user.roles = base.roles
  }
  return user
}

export async function addAppBuilder(user: User, appId: string) {
  const prodAppId = getProdAppID(appId)
  user.builder ??= {}
  user.builder.creator = true
  user.builder.apps ??= []
  user.builder.apps.push(prodAppId)
  await UserDB.save(user, { hashPassword: false })
}

export async function removeAppBuilder(user: User, appId: string) {
  const prodAppId = getProdAppID(appId)
  if (user.builder && user.builder.apps?.includes(prodAppId)) {
    user.builder.apps = user.builder.apps.filter(id => id !== prodAppId)
  }
  await UserDB.save(user, { hashPassword: false })
}
