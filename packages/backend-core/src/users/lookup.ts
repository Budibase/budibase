import {
  AccountMetadata,
  PlatformUser,
  PlatformUserByEmail,
  User,
} from "@budibase/types"
import * as dbUtils from "../db"
import { ViewName } from "../constants"
import { getExistingInvites } from "../cache/invite"

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

  const invitedEmails = await getExistingInvites(emails)
  matchedEmails.push(...invitedEmails.map(invite => invite.email))

  return [...new Set(matchedEmails.map(email => email.toLowerCase()))]
}

// lookup, could be email or userId, either will return a doc
export async function getPlatformUsers(
  identifier: string
): Promise<PlatformUser[]> {
  // use the view here and allow to find anyone regardless of casing
  // Use lowercase to ensure email login is case insensitive
  return await dbUtils.queryPlatformView(ViewName.PLATFORM_USERS_LOWERCASE, {
    keys: [identifier.toLowerCase()],
    include_docs: true,
  })
}

export async function getFirstPlatformUser(
  identifier: string
): Promise<PlatformUser | null> {
  const platformUserDocs = await getPlatformUsers(identifier)
  return platformUserDocs[0] ?? null
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
  return await dbUtils.queryPlatformView(
    ViewName.PLATFORM_USERS_LOWERCASE,
    params
  )
}

export async function getExistingAccounts(
  emails: string[]
): Promise<AccountMetadata[]> {
  const lcEmails = emails.map(email => email.toLowerCase())
  const params = {
    keys: lcEmails,
    include_docs: true,
  }
  return await dbUtils.queryPlatformView(ViewName.ACCOUNT_BY_EMAIL, params)
}
