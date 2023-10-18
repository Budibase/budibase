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
  SearchQuery,
  SearchQueryOperators,
  SearchUsersRequest,
  User,
  ContextUser,
} from "@budibase/types"
import { getGlobalDB } from "../context"
import * as context from "../context"
import { isCreator } from "./utils"

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

export const isSupportedUserSearch = (query: SearchQuery) => {
  const allowed = [
    { op: SearchQueryOperators.STRING, key: "email" },
    { op: SearchQueryOperators.EQUAL, key: "_id" },
  ]
  for (let [key, operation] of Object.entries(query)) {
    if (typeof operation !== "object") {
      return false
    }
    const fields = Object.keys(operation || {})
    // this filter doesn't contain options - ignore
    if (fields.length === 0) {
      continue
    }
    const allowedOperation = allowed.find(
      allow =>
        allow.op === key && fields.length === 1 && fields[0] === allow.key
    )
    if (!allowedOperation) {
      return false
    }
  }
  return true
}

export const bulkGetGlobalUsersById = async (
  userIds: string[],
  opts?: GetOpts
) => {
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

export const getAllUserIds = async () => {
  const db = getGlobalDB()
  const startKey = `${DocumentType.USER}${SEPARATOR}`
  const response = await db.allDocs({
    startkey: startKey,
    endkey: `${startKey}${UNICODE_MAX}`,
  })
  return response.rows.map(row => row.id)
}

export const bulkUpdateGlobalUsers = async (users: User[]) => {
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
export const getGlobalUserByEmail = async (
  email: String,
  opts?: GetOpts
): Promise<User | undefined> => {
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

export const searchGlobalUsersByApp = async (
  appId: any,
  opts: any,
  getOpts?: GetOpts
) => {
  if (typeof appId !== "string") {
    throw new Error("Must provide a string based app ID")
  }
  const params = getUsersByAppParams(appId, {
    include_docs: true,
  })
  params.startkey = opts && opts.startkey ? opts.startkey : params.startkey
  let response = await queryGlobalView(ViewName.USER_BY_APP, params)

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
export const searchGlobalUsersByAppAccess = async (appId: any, opts: any) => {
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

  let searchOptions = {
    selector: {
      $or: orQuery,
      _id: {
        $regex: "^us_",
      },
    },
    limit: opts?.limit || 50,
  }

  const resp = await directCouchFind(context.getGlobalDBName(), searchOptions)
  return resp?.rows
}

export const getGlobalUserByAppPage = (appId: string, user: User) => {
  if (!user) {
    return
  }
  return generateAppUserID(getProdAppID(appId)!, user._id!)
}

/**
 * Performs a starts with search on the global email view.
 */
export const searchGlobalUsersByEmail = async (
  email: string | unknown,
  opts: any,
  getOpts?: GetOpts
) => {
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
export const paginatedUsers = async ({
  bookmark,
  query,
  appId,
}: SearchUsersRequest = {}) => {
  const db = getGlobalDB()
  // get one extra document, to have the next page
  const opts: any = {
    include_docs: true,
    limit: PAGE_LIMIT + 1,
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
  } else {
    // no search, query allDocs
    const response = await db.allDocs(getGlobalUserParams(null, opts))
    userList = response.rows.map((row: any) => row.doc)
  }
  return pagination(userList, PAGE_LIMIT, {
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
    creators += page.data.filter(isCreator).length
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
