import {
  ViewName,
  getUsersByAppParams,
  getProdAppID,
  generateAppUserID,
  queryGlobalView,
  UNICODE_MAX,
} from "./db"
import { BulkDocsResponse, User } from "@budibase/types"
import { getGlobalDB } from "./context"

export const bulkGetGlobalUsersById = async (userIds: string[]) => {
  const db = getGlobalDB()
  return (
    await db.allDocs({
      keys: userIds,
      include_docs: true,
    })
  ).rows.map(row => row.doc) as User[]
}

export const bulkUpdateGlobalUsers = async (users: User[]) => {
  const db = getGlobalDB()
  return (await db.bulkDocs(users)) as BulkDocsResponse
}

/**
 * Given an email address this will use a view to search through
 * all the users to find one with this email address.
 * @param {string} email the email to lookup the user by.
 */
export const getGlobalUserByEmail = async (
  email: String
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

  return response
}

export const searchGlobalUsersByApp = async (appId: any, opts: any) => {
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
  return Array.isArray(response) ? response : [response]
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
export const searchGlobalUsersByEmail = async (email: string, opts: any) => {
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
  return Array.isArray(response) ? response : [response]
}
