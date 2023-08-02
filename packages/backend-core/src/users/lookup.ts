import {
  AccountMetadata,
  PlatformUser,
  PlatformUserByEmail,
  User,
} from "@budibase/types"
import * as dbUtils from "../db"
import { ViewName } from "../constants"

/**
 * Apply a system-wide search on emails:
 * - in tenant
 * - cross tenant
 * - accounts
 * return an array of emails that match the supplied emails.
 */
export async function searchExistingEmails(emails: string[]) {
  let matchedEmails: string[] = []

  const existingTenantUsers = await getExistingTenantUsers(emails)
  matchedEmails.push(...existingTenantUsers.map(user => user.email))

  const existingPlatformUsers = await getExistingPlatformUsers(emails)
  matchedEmails.push(...existingPlatformUsers.map(user => user._id!))

  const existingAccounts = await getExistingAccounts(emails)
  matchedEmails.push(...existingAccounts.map(account => account.email))

  return [...new Set(matchedEmails.map(email => email.toLowerCase()))]
}

// lookup, could be email or userId, either will return a doc
export async function getPlatformUser(
  identifier: string
): Promise<PlatformUser | null> {
  // use the view here and allow to find anyone regardless of casing
  // Use lowercase to ensure email login is case insensitive
  return (await dbUtils.queryPlatformView(ViewName.PLATFORM_USERS_LOWERCASE, {
    keys: [identifier.toLowerCase()],
    include_docs: true,
  })) as PlatformUser
}

export async function getExistingTenantUsers(
  emails: string[]
): Promise<User[]> {
  const lcEmails = emails.map(email => email.toLowerCase())
  const params = {
    keys: lcEmails,
    include_docs: true,
  }

  const opts = {
    arrayResponse: true,
  }

  return (await dbUtils.queryGlobalView(
    ViewName.USER_BY_EMAIL,
    params,
    undefined,
    opts
  )) as User[]
}

export async function getExistingPlatformUsers(
  emails: string[]
): Promise<PlatformUserByEmail[]> {
  const lcEmails = emails.map(email => email.toLowerCase())
  const params = {
    keys: lcEmails,
    include_docs: true,
  }

  const opts = {
    arrayResponse: true,
  }
  return (await dbUtils.queryPlatformView(
    ViewName.PLATFORM_USERS_LOWERCASE,
    params,
    opts
  )) as PlatformUserByEmail[]
}

export async function getExistingAccounts(
  emails: string[]
): Promise<AccountMetadata[]> {
  const lcEmails = emails.map(email => email.toLowerCase())
  const params = {
    keys: lcEmails,
    include_docs: true,
  }

  const opts = {
    arrayResponse: true,
  }

  return (await dbUtils.queryPlatformView(
    ViewName.ACCOUNT_BY_EMAIL,
    params,
    opts
  )) as AccountMetadata[]
}
